from fastapi.testclient import TestClient

from vital_api.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"ok": True}


def test_browser_preflight_allows_the_local_app():
    response = client.options(
        "/ask",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
            "Access-Control-Request-Private-Network": "true",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-private-network"] == "true"


def test_ask_rejects_an_empty_question():
    response = client.post("/ask", json={"question": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "Question is required"
