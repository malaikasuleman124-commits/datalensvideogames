import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

def test_chat_empty_message():
    with TestClient(app) as client:
        response = client.post("/api/chat", json={"message": ""})
        assert response.status_code == 400

@patch("app.services.llm.chat_service.get_response")
def test_chat_success(mock_get_response):
    mock_get_response.return_value = "The top game is Wii Sports."
    with TestClient(app) as client:
        response = client.post("/api/chat", json={"message": "What is the top game?"})
        assert response.status_code == 200
        assert response.json()["reply"] == "The top game is Wii Sports."

def test_chat_no_api_key():
    # Test behavior when API key is missing (service returns specific message)
    with patch("app.services.llm.os.getenv", return_value=None):
        # We need to force a re-initialization or mock the initialized state
        with patch("app.services.llm.chat_service.initialized", False):
            with TestClient(app) as client:
                response = client.post("/api/chat", json={"message": "Hello"})
                assert response.status_code == 200
                assert "Gemini API key is missing" in response.json()["reply"]
