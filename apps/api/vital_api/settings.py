import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_MODEL = "mistralai/mistral-small-3.2-24b-instruct"
WEB_ENV = Path(__file__).resolve().parents[3] / "apps" / "web" / ".env"


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

    def chat_model(self) -> str:
        return self.openrouter_model or DEFAULT_MODEL

    def voice(self) -> str:
        return self.voxtral_voice or "gb_jane_neutral"

    def langfuse_host(self) -> str:
        return self.langfuse_base_url or "https://cloud.langfuse.com"

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
