from typing import Literal

from langchain_core.tools import tool
from pydantic import BaseModel, Field

from vital_api.energy import compute_energy, energy_level
from vital_api.health import DailyHealth, Day, VsUsual, js_round

MAX_QUESTION_LENGTH = 300
MAX_ANSWER_LENGTH = 600


class DayInput(BaseModel):
    day: Literal["today", "yesterday"] | None = Field(
        default=None,
        description="Omit for last night or today. Use yesterday only for the previous day.",
    )


class MainContributor(BaseModel):
    label: str
    vsUsual: VsUsual


class SleepReading(BaseModel):
    day: Day
    sleepHours: float
    usualHours: float
    vsUsual: VsUsual


class EnergyReading(BaseModel):
    day: Day
    bodyBattery: int
    level: str
    mainContributor: MainContributor


def requested_day(day: Day | None) -> Day:
    return "yesterday" if day == "yesterday" else "today"


def series_for(days: list[DailyHealth], day: Day) -> list[DailyHealth]:
    series = days[:-1] if day == "yesterday" else days
    if len(series) < 2:
        raise ValueError("Not enough history")
    return series


def vs_usual(value: float, baseline: float) -> VsUsual:
    delta = js_round((value - baseline) * 10) / 10
    if delta > 0:
        return "higher"
    if delta < 0:
        return "lower"
    return "same"


def sleep_reading(days: list[DailyHealth], day: Day = "today") -> SleepReading:
    energy = compute_energy(series_for(days, day))
    sleep = next((item for item in energy.contributors if item.label == "Sleep"), None)
    if sleep is None:
        raise ValueError("Sleep is missing")
    return SleepReading(
        day=day,
        sleepHours=sleep.today,
        usualHours=sleep.baseline,
        vsUsual=vs_usual(sleep.today, sleep.baseline),
    )


def energy_reading(days: list[DailyHealth], day: Day = "today") -> EnergyReading:
    energy = compute_energy(series_for(days, day))
    main = sorted(energy.contributors, key=lambda item: abs(item.impact), reverse=True)[0]
    return EnergyReading(
        day=day,
        bodyBattery=energy.score,
        level=energy_level(energy.score),
        mainContributor=MainContributor(
            label=main.label,
            vsUsual=vs_usual(main.today, main.baseline),
        ),
    )


def health_tools(days: list[DailyHealth]):
    @tool(args_schema=DayInput)
    def sleep(day: Day | None = None) -> str:
        """Sleep compared with this person's usual. Use only when the question is about sleep, not for a general how-are-you."""
        return sleep_reading(days, requested_day(day)).model_dump_json()

    @tool(args_schema=DayInput)
    def energy(day: Day | None = None) -> str:
        """Body battery, including sleep versus usual. Use for how they feel or how hard to move. Do not also call sleep."""
        return energy_reading(days, requested_day(day)).model_dump_json()

    return [sleep, energy]
