from fastapi.testclient import TestClient

from vital_api.limits import RateLimiter
from vital_api.main import PROXY_HEADER, create_app
from vital_api.settings import Settings


class Clock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_allows_up_to_the_limit_then_says_how_long_to_wait():
    clock = Clock()
    limiter = RateLimiter(2, window=60, clock=clock)
    assert limiter.retry_after("a") == 0
    clock.now = 10
    assert limiter.retry_after("a") == 0
    clock.now = 20
    assert limiter.retry_after("a") == 40


def test_the_window_slides_and_keys_are_separate():
    clock = Clock()
    limiter = RateLimiter(1, window=60, clock=clock)
    assert limiter.retry_after("a") == 0
    assert limiter.retry_after("b") == 0
    assert limiter.retry_after("a") == 60
    clock.now = 60
    assert limiter.retry_after("a") == 0


def test_a_refused_call_does_not_extend_the_wait():
    clock = Clock()
    limiter = RateLimiter(1, window=60, clock=clock)
    limiter.retry_after("a")
    clock.now = 30
    assert limiter.retry_after("a") == 30
    clock.now = 60
    assert limiter.retry_after("a") == 0


def test_zero_turns_the_limit_off():
    limiter = RateLimiter(0)
    assert all(limiter.retry_after("a") == 0 for _ in range(100))


def empty_question(client: TestClient, **headers: str):
    # An empty question is refused before any model call, so these tests stay offline.
    return client.post("/ask", json={"question": " "}, headers=headers)


def test_api_answers_429_with_retry_after_once_a_client_is_over():
    client = TestClient(create_app(Settings(rate_limit_per_minute=2, rate_limit_global_per_minute=0)))
    assert [empty_question(client).status_code for _ in range(3)] == [400, 400, 429]
    refused = empty_question(client)
    assert int(refused.headers["retry-after"]) > 0
    assert "Try again" in refused.json()["detail"]


def test_the_global_budget_caps_everyone_together():
    settings = Settings(rate_limit_per_minute=0, rate_limit_global_per_minute=1, proxy_secret="s3cret")
    client = TestClient(create_app(settings))
    first = empty_question(client, **{PROXY_HEADER: "s3cret", "x-forwarded-for": "203.0.113.1"})
    second = empty_question(client, **{PROXY_HEADER: "s3cret", "x-forwarded-for": "203.0.113.2"})
    assert [first.status_code, second.status_code] == [400, 429]


def test_health_is_never_limited():
    client = TestClient(create_app(Settings(rate_limit_per_minute=1, rate_limit_global_per_minute=1)))
    assert [client.get("/health").status_code for _ in range(5)] == [200] * 5


def test_a_proxy_secret_shuts_out_direct_callers():
    client = TestClient(create_app(Settings(proxy_secret="s3cret")))
    assert empty_question(client).status_code == 403
    assert empty_question(client, **{PROXY_HEADER: "wrong"}).status_code == 403
    assert empty_question(client, **{PROXY_HEADER: "s3cret"}).status_code == 400
    assert client.get("/health").status_code == 200


def test_the_trusted_proxy_names_the_real_client():
    settings = Settings(proxy_secret="s3cret", rate_limit_per_minute=1, rate_limit_global_per_minute=0)
    client = TestClient(create_app(settings))
    ask = lambda ip: empty_question(client, **{PROXY_HEADER: "s3cret", "x-forwarded-for": ip}).status_code  # noqa: E731
    assert [ask("203.0.113.1"), ask("203.0.113.2"), ask("203.0.113.1")] == [400, 400, 429]


def test_forwarded_for_is_ignored_without_the_secret():
    client = TestClient(create_app(Settings(rate_limit_per_minute=1, rate_limit_global_per_minute=0)))
    spoof = lambda ip: empty_question(client, **{"x-forwarded-for": ip}).status_code  # noqa: E731
    assert [spoof("203.0.113.1"), spoof("203.0.113.2")] == [400, 429]


def test_extra_origins_come_from_settings():
    client = TestClient(create_app(Settings(allowed_origins="https://vital.example.com/, https://other.example.com")))
    response = client.options(
        "/ask",
        headers={"Origin": "https://vital.example.com", "Access-Control-Request-Method": "POST"},
    )
    assert response.headers["access-control-allow-origin"] == "https://vital.example.com"
