from pydantic import BaseModel

from vital_api.health import DailyHealth, js_round


class Contributor(BaseModel):
    label: str
    today: float
    baseline: float
    unit: str
    impact: int


class Energy(BaseModel):
    score: int
    contributors: list[Contributor]
    today: DailyHealth
    yesterday: DailyHealth


def clamp(value: float, low: float, high: float) -> float:
    return min(high, max(low, value))


def round1(value: float) -> float:
    return js_round(value * 10) / 10


def average(days: list[DailyHealth], key: str) -> float:
    return sum(getattr(day, key) for day in days) / len(days)


def energy_level(score: int) -> str:
    if score < 30:
        return "Low"
    if score < 60:
        return "Moderate"
    return "Good"


def compute_energy(days: list[DailyHealth]) -> Energy:
    if len(days) < 2:
        raise ValueError("Not enough history")
    today = days[-1]
    yesterday = days[-2]
    history = days[:-1]

    sleep_base = average(history, "sleepHours")
    hrv_base = average(history, "hrvMs")
    rhr_base = average(history, "restingHr")

    contributors = [
        Contributor(
            label="Sleep",
            today=today.sleepHours,
            baseline=round1(sleep_base),
            unit="h",
            impact=js_round(clamp((today.sleepHours - sleep_base) * 6, -20, 15)),
        ),
        Contributor(
            label="HRV",
            today=today.hrvMs,
            baseline=float(js_round(hrv_base)),
            unit="ms",
            impact=js_round(clamp(((today.hrvMs - hrv_base) / hrv_base) * 50, -20, 15)),
        ),
        Contributor(
            label="Resting HR",
            today=today.restingHr,
            baseline=float(js_round(rhr_base)),
            unit="bpm",
            impact=js_round(clamp((rhr_base - today.restingHr) * 2, -15, 10)),
        ),
    ]
    score = int(clamp(75 + sum(item.impact for item in contributors), 0, 100))
    return Energy(score=score, contributors=contributors, today=today, yesterday=yesterday)
