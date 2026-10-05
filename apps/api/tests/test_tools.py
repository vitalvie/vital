from vital_api.health import WELL_RESTED, mock_health, parse_today, with_today
from vital_api.tools import DayInput, energy_reading, health_tools, sleep_reading


def rested():
    return with_today(mock_health(), WELL_RESTED)


def test_sleep_reading_compares_last_night_without_the_history():
    reading = sleep_reading(rested())
    assert reading.day == "today"
    assert reading.sleepHours == 8.2
    assert reading.usualHours == 7.5
    assert reading.vsUsual == "higher"
    assert "last14Days" not in reading.model_dump_json()


def test_sleep_reading_uses_the_previous_day():
    reading = sleep_reading(rested(), "yesterday")
    assert reading.day == "yesterday"
    assert reading.sleepHours == 7.3


def test_energy_reading_returns_the_score_and_the_largest_move():
    reading = energy_reading(rested())
    assert reading.bodyBattery == 95
    assert reading.level == "Good"
    assert reading.mainContributor.label == "HRV"
    assert reading.mainContributor.vsUsual == "higher"
    assert "last14Days" not in reading.model_dump_json()


def test_sleep_tool_uses_a_pydantic_schema():
    sleep = next(item for item in health_tools(mock_health()) if item.name == "sleep")
    assert issubclass(sleep.args_schema, DayInput)


def test_parse_today_clamps_and_fills_gaps():
    today = parse_today({"sleepHours": 99, "hrvMs": "nope"})
    assert today.sleepHours == 10
    assert today.hrvMs == WELL_RESTED.hrvMs
    assert today.restingHr == WELL_RESTED.restingHr
