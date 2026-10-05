from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from vital_api.agent import PriorTurn, answer_question
from vital_api.health import Today, mock_health, parse_today, with_today
from vital_api.settings import apply_env
from vital_api.voice import synthesize_speech, transcribe_audio

apply_env()

app = FastAPI(title="Vital")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    allow_private_network=True,
)


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


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/ask", response_model=AskOut)
def ask(body: AskIn) -> AskOut:
    days = with_today(mock_health(), parse_today(None if body.today is None else body.today.model_dump()))
    try:
        result = answer_question(body.question, days, body.prior)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
    except Exception as error:
        raise HTTPException(502, str(error)) from error
    return AskOut(text=result.text)


@app.post("/transcribe", response_model=TranscriptOut)
async def transcribe(audio: UploadFile = File(...)) -> TranscriptOut:
    data = await audio.read()
    try:
        text = await transcribe_audio(data, audio.content_type or "", audio.filename or "")
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
    except Exception as error:
        raise HTTPException(502, str(error)) from error
    return TranscriptOut(text=text)


@app.post("/synthesize", response_model=SpeechOut)
async def synthesize(body: SpeechIn) -> SpeechOut:
    try:
        audio = await synthesize_speech(body.text)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
    except Exception as error:
        raise HTTPException(502, str(error)) from error
    return SpeechOut(audio=audio)
