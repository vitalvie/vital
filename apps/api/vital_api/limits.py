import time
from collections import defaultdict, deque
from collections.abc import Callable
from threading import Lock


class RateLimiter:
    """Sliding window: at most `limit` calls per `window` seconds for each key.

    In memory, per process. Enough for one small instance; it protects the model budget, not a fleet.
    """

    def __init__(self, limit: int, window: float = 60.0, clock: Callable[[], float] = time.monotonic) -> None:
        self.limit = limit
        self.window = window
        self.clock = clock
        self.calls: dict[str, deque[float]] = defaultdict(deque)
        self.lock = Lock()

    def retry_after(self, key: str) -> int:
        """Records a call and returns 0, or returns the seconds to wait without recording it."""
        if self.limit <= 0:
            return 0
        now = self.clock()
        with self.lock:
            calls = self.calls[key]
            while calls and now - calls[0] >= self.window:
                calls.popleft()
            if len(calls) >= self.limit:
                return max(1, int(self.window - (now - calls[0]) + 0.999))
            calls.append(now)
            if len(self.calls) > 10_000:
                self.forget_idle(now)
            return 0

    def forget_idle(self, now: float) -> None:
        for key in [k for k, calls in self.calls.items() if not calls or now - calls[-1] >= self.window]:
            del self.calls[key]
