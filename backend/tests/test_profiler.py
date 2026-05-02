import pytest
from fastapi.testclient import TestClient
from app.main import app
import io

def test_profile_endpoint():
    with TestClient(app) as client:
        # 1. Upload mock data to ensure predictable profiling
        csv_content = b"name,platform,year_of_release,genre,publisher,na_sales,eu_sales,jp_sales,other_sales,global_sales,critic_score,critic_count,user_score,user_count,developer,rating\n" \
                      b"Game A,PS4,2020,Action,Pub A,1.0,0.5,0.1,0.1,1.7,80,50,8.0,100,Dev A,M\n" \
                      b"Game B,PC,2021,RPG,Pub B,2.0,1.0,0.2,0.2,3.4,90,60,9.0,200,Dev B,T\n"
        
        client.post(
            "/api/upload",
            files={"file": ("test_profile.csv", io.BytesIO(csv_content), "text/csv")}
        )
        
        # 2. Fetch the profile
        response = client.get("/api/profile")
        assert response.status_code == 200
        data = response.json()
        
        assert data["total_games"] == 2
        assert data["min_year"] == 2020
        assert data["max_year"] == 2021
        assert data["total_global_sales"] == 5.1
