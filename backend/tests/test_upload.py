import pytest
from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

def test_upload_invalid_file_type():
    file_content = b"This is not a CSV"
    response = client.post(
        "/api/upload",
        files={"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    )
    assert response.status_code == 400
    assert "Only CSV files are allowed" in response.json()["detail"]

def test_upload_valid_csv():
    # Because we're using FastAPI TestClient with lifespan events in newer FastAPI versions, 
    # we should ideally use `with TestClient(app) as client:` if lifespan events are critical.
    # We will use the context manager to ensure DB is initialized for the test.
    with TestClient(app) as client:
        csv_content = b"name,platform,year_of_release,genre,publisher,na_sales,eu_sales,jp_sales,other_sales,global_sales,critic_score,critic_count,user_score,user_count,developer,rating\n" \
                      b"Wii Sports,Wii,2006,Sports,Nintendo,41.36,28.96,3.77,8.45,82.53,76,51,8,322,Nintendo,E\n"
        response = client.post(
            "/api/upload",
            files={"file": ("test_sales.csv", io.BytesIO(csv_content), "text/csv")}
        )
        assert response.status_code == 200
        assert response.json()["message"] == "Dataset uploaded and processed successfully."
        assert response.json()["rows_inserted"] == 1
