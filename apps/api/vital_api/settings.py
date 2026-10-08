import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_MODEL = "mistralai/mistral-small-3.2-24b-instruct"
LOCAL_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
# In the repo this is apps/web/.env. In a container the file is absent and the environment is used as is.
WEB_ENV = Path(__file__).resolve().parent.parent.parent.parent / "apps" / "web" / ".env"


def read_env_file(path: Path) -> dict[str, str]:
    if not path.is_file():
        return {}
    values: dict[str, str] = {}
    for line in path.read_text().splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    openrouter_api_key: str = ""
    openrouter_model: str = ""
    voxtral_voice: str = ""
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_base_url: str = ""
    typesafe_api_key: str = ""
    jev_model: str = ""
    # Extra browser origins allowed to call the API directly, comma-separated.
    allowed_origins: str = ""
    # When set, only callers that send it in X-Vital-Proxy are served (the web Worker).
    proxy_secret: str = ""
    # Calls per minute to /ask, /transcribe and /synthesize. One spoken question makes three. 0 turns a limit off.
    rate_limit_per_minute: int = 30
    rate_limit_global_per_minute: int = 300

    def chat_model(self) -> str:
        return self.openrouter_model or DEFAULT_MODEL

    def voice(self) -> str:
        return self.voxtral_voice or "gb_jane_neutral"

    def langfuse_host(self) -> str:
        return self.langfuse_base_url or "https://cloud.langfuse.com"

    def origins(self) -> list[str]:
        extra = [origin.strip().rstrip("/") for origin in self.allowed_origins.split(",") if origin.strip()]
        return [*LOCAL_ORIGINS, *extra]

    def tracing_enabled(self) -> bool:
        return bool(self.langfuse_public_key and self.langfuse_secret_key)


def apply_env() -> Settings:
    for key, value in read_env_file(WEB_ENV).items():
        os.environ.setdefault(key, value)
    settings = Settings()
    if settings.tracing_enabled():
        os.environ["LANGFUSE_PUBLIC_KEY"] = settings.langfuse_public_key
        os.environ["LANGFUSE_SECRET_KEY"] = settings.langfuse_secret_key
        os.environ["LANGFUSE_BASE_URL"] = settings.langfuse_host()
    return settings
