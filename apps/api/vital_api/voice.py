import base64

import httpx

from vital_api.settings import apply_env

OPENROUTER = "https://openrouter.ai/api/v1"
TRANSCRIBE_MODEL = "mistralai/voxtral-mini-transcribe"
SPEECH_MODEL = "mistralai/voxtral-mini-tts-2603"
TIMEOUT_S = 15.0
MAX_AUDIO_BYTES = 5 * 1024 * 1024
MAX_SPEECH_CHARS = 800


def audio_format(mime: str, name: str) -> str:
    hint = f"{mime} {name}".lower()
    if "wav" in hint:
        return "wav"
    if "mpeg" in hint or "mp3" in hint:
        return "mp3"
    if "mp4" in hint or "m4a" in hint or "aac" in hint:
        return "m4a"
    if "flac" in hint:
        return "flac"
    if "ogg" in hint:
        return "ogg"
    return "webm"


def _failure(response: httpx.Response, label: str) -> str:
    message = response.reason_phrase
    try:
        body = response.json()
        nested = body.get("error", {}).get("message")
        if isinstance(nested, str) and nested:
            message = nested
    except ValueError:
        pass
    return f"{label} failed ({response.status_code}): {message}"


def _retryable(status: int) -> bool:
    return status == 429 or status >= 500


async def post(path: str, body: dict, label: str) -> httpx.Response:
    settings = apply_env()
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vital.vitalvie.workers.dev",
        "X-OpenRouter-Title": "Vital",
    }
    async with httpx.AsyncClient(timeout=TIMEOUT_S) as client:
        for attempt in range(2):
            try:
                response = await client.post(f"{OPENROUTER}{path}", headers=headers, json=body)
            except httpx.TimeoutException:
                if attempt == 0:
                    continue
                raise
            if response.status_code == 200:
                return response
            if _retryable(response.status_code) and attempt == 0:
                continue
            raise RuntimeError(_failure(response, label))
    raise RuntimeError(f"{label} failed")


async def transcribe_audio(data: bytes, mime: str, name: str) -> str:
    if not data:
        raise ValueError("Audio is required")
    if len(data) > MAX_AUDIO_BYTES:
        raise ValueError("Recording is too long")
    response = await post(
        "/audio/transcriptions",
        {
            "model": TRANSCRIBE_MODEL,
            "language": "en",
            "input_audio": {
                "data": base64.b64encode(data).decode("ascii"),
                "format": audio_format(mime, name),
            },
        },
        "OpenRouter transcription",
    )
    text = str(response.json().get("text") or "").strip()
    if not text:
        raise RuntimeError("Empty transcription")
    return text


async def synthesize_speech(text: str) -> str:
    spoken = text.strip()[:MAX_SPEECH_CHARS]
    if not spoken:
        raise ValueError("Text is required")
    settings = apply_env()
    response = await post(
        "/audio/speech",
        {
            "model": SPEECH_MODEL,
            "input": spoken,
            "voice": settings.voice(),
            "response_format": "mp3",
        },
        "OpenRouter speech",
    )
    if not response.content:
        raise RuntimeError("Empty audio")
    return base64.b64encode(response.content).decode("ascii")
