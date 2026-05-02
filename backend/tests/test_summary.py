import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

def test_summary_no_data():
    with TestClient(app) as client:
        # Mock profiler to return empty state
        with patch("app.routers.summary.get_data_profile", return_value={"total_games": 0}):
            response = client.get("/api/summary")
            assert response.status_code == 200
            assert "No data available" in response.json()["summary"]

@patch("app.services.llm.chat_service.generate_executive_summary")
@patch("app.routers.summary.get_data_profile")
@patch("app.routers.summary.get_genre_sales")
def test_summary_with_data(mock_genre_sales, mock_profile, mock_gen_summary):
    mock_profile.return_value = {
        "total_games": 100,
        "min_year": 1980,
        "max_year": 2020,
        "total_global_sales": 500.0
    }
    mock_genre_sales.return_value = [{"genre": "Action", "sales": 200}]
    mock_gen_summary.return_value = "This is a professional AI summary highlighting Action games."
    
    with TestClient(app) as client:
        response = client.get("/api/summary")
        assert response.status_code == 200
        assert response.json()["summary"] == "This is a professional AI summary highlighting Action games."
