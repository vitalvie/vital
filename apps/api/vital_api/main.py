from hmac import compare_digest

from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from vital_api.agent import PriorTurn, answer_question
from vital_api.health import Today, mock_health, parse_today, with_today
from vital_api.limits import RateLimiter
from vital_api.settings import Settings, apply_env
from vital_api.voice import synthesize_speech, transcribe_audio

PROXY_HEADER = "x-vital-proxy"


class AskIn(BaseModel):
    question: str
    today: Today | None = None
    prior: PriorTurn | None = None


class AskOut(BaseModel):
    text: str


class SpeechIn(BaseModel):
    text: str


class SpeechOut(BaseModel):
    audio: str


class TranscriptOut(BaseModel):
    text: str


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or apply_env()
    per_client = RateLimiter(settings.rate_limit_per_minute)
    everyone = RateLimiter(settings.rate_limit_global_per_minute)

    app = FastAPI(title="Vital")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins(),
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
        allow_private_network=True,
    )

    def guard(request: Request) -> None:
        """Keeps strangers out when a proxy secret is set, then spends one call from the budgets."""
        trusted = bool(settings.proxy_secret) and compare_digest(
            request.headers.get(PROXY_HEADER, ""), settings.proxy_secret
        )
        if settings.proxy_secret and not trusted:
            raise HTTPException(403, "Forbidden")
        # Only the trusted proxy may say who the caller is. Anyone else is their own socket address.
        forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip() if trusted else ""
        client = forwarded or (request.client.host if request.client else "unknown")
        wait = per_client.retry_after(client) or everyone.retry_after("all")
        if wait:
            raise HTTPException(429, "Too many questions. Try again in a minute.", headers={"Retry-After": str(wait)})

    guarded = [Depends(guard)]

    @app.get("/health")
    def health() -> dict[str, bool]:
        return {"ok": True}


    @app.post("/ask", response_model=AskOut, dependencies=guarded)
    def ask(body: AskIn) -> AskOut:
        days = with_today(mock_health(), parse_today(None if body.today is None else body.today.model_dump()))
        try:
            result = answer_question(body.question, days, body.prior)
        except ValueError as error:
            raise HTTPException(400, str(error)) from error
        except Exception as error:
            raise HTTPException(502, str(error)) from error
        return AskOut(text=result.text)


    @app.post("/transcribe", response_model=TranscriptOut, dependencies=guarded)
    async def transcribe(audio: UploadFile = File(...)) -> TranscriptOut:
        data = await audio.read()
        try:
            text = await transcribe_audio(data, audio.content_type or "", audio.filename or "")
        except ValueError as error:
            raise HTTPException(400, str(error)) from error
        except Exception as error:
            raise HTTPException(502, str(error)) from error
        return TranscriptOut(text=text)


    @app.post("/synthesize", response_model=SpeechOut, dependencies=guarded)
    async def synthesize(body: SpeechIn) -> SpeechOut:
        try:
            audio = await synthesize_speech(body.text)
        except ValueError as error:
            raise HTTPException(400, str(error)) from error
        except Exception as error:
            raise HTTPException(502, str(error)) from error
        return SpeechOut(audio=audio)

    return app


app = create_app()
