import math
from typing import Literal

from pydantic import BaseModel, ConfigDict

# Keep these rows aligned with apps/web/src/data/mock-health.ts.
SAMPLES: list[dict[str, float]] = [
    {"sleepHours": 7.6, "hrvMs": 49, "restingHr": 56, "steps": 8400, "activeEnergyKcal": 480},
    {"sleepHours": 7.2, "hrvMs": 47, "restingHr": 57, "steps": 9100, "activeEnergyKcal": 520},
    {"sleepHours": 8.1, "hrvMs": 52, "restingHr": 55, "steps": 6200, "activeEnergyKcal": 390},
    {"sleepHours": 6.9, "hrvMs": 45, "restingHr": 57, "steps": 11200, "activeEnergyKcal": 640},
    {"sleepHours": 7.4, "hrvMs": 48, "restingHr": 56, "steps": 7800, "activeEnergyKcal": 450},
    {"sleepHours": 7.8, "hrvMs": 51, "restingHr": 55, "steps": 10400, "activeEnergyKcal": 600},
    {"sleepHours": 8.3, "hrvMs": 53, "restingHr": 54, "steps": 5400, "activeEnergyKcal": 340},
    {"sleepHours": 7.1, "hrvMs": 46, "restingHr": 57, "steps": 9600, "activeEnergyKcal": 560},
    {"sleepHours": 7.5, "hrvMs": 49, "restingHr": 56, "steps": 8800, "activeEnergyKcal": 500},
    {"sleepHours": 6.8, "hrvMs": 44, "restingHr": 58, "steps": 12300, "activeEnergyKcal": 700},
    {"sleepHours": 7.7, "hrvMs": 50, "restingHr": 55, "steps": 7300, "activeEnergyKcal": 430},
    {"sleepHours": 7.9, "hrvMs": 51, "restingHr": 55, "steps": 8100, "activeEnergyKcal": 470},
    {"sleepHours": 7.3, "hrvMs": 47, "restingHr": 56, "steps": 16800, "activeEnergyKcal": 1150},
    {"sleepHours": 5.4, "hrvMs": 34, "restingHr": 62, "steps": 2100, "activeEnergyKcal": 120},
]

Day = Literal["today", "yesterday"]
VsUsual = Literal["higher", "lower", "same"]


class DailyHealth(BaseModel):
    date: str
    sleepHours: float
    hrvMs: float
    restingHr: float
    steps: float
    activeEnergyKcal: float


class Today(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sleepHours: float
    hrvMs: float
    restingHr: float


class Signal(BaseModel):
    key: Literal["sleepHours", "hrvMs", "restingHr"]
    min: float
    max: float
    step: float


SIGNALS = [
    Signal(key="sleepHours", min=3, max=10, step=0.1),
    Signal(key="hrvMs", min=15, max=90, step=1),
    Signal(key="restingHr", min=40, max=90, step=1),
]

WELL_RESTED = Today(sleepHours=8.2, hrvMs=58, restingHr=53)


def mock_health() -> list[DailyHealth]:
    return [DailyHealth(date=f"day-{index}", **sample) for index, sample in enumerate(SAMPLES)]


def js_round(value: float) -> int:
    """Match JavaScript Math.round so the score stays aligned with the UI."""
    return math.floor(value + 0.5)


def parse_today(raw: dict[str, object] | None) -> Today:
    today = WELL_RESTED.model_copy()
    if not raw:
        return today
    values = today.model_dump()
    for signal in SIGNALS:
        try:
            number = float(raw.get(signal.key))  # type: ignore[arg-type]
        except (TypeError, ValueError):
            continue
        if not math.isfinite(number):
            continue
        clamped = min(signal.max, max(signal.min, number))
        snapped = js_round(clamped / signal.step) * signal.step
        places = 1 if signal.step < 1 else 0
        values[signal.key] = float(f"{snapped:.{places}f}")
    return Today.model_validate(values)


def with_today(days: list[DailyHealth], today: Today) -> list[DailyHealth]:
    updated = [day.model_copy() for day in days]
    updated[-1] = updated[-1].model_copy(update=today.model_dump())
    return updated
