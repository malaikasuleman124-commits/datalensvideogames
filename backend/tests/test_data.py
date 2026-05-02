import pytest
from fastapi.testclient import TestClient
from app.main import app
import io

def test_data_filtering():
    with TestClient(app) as client:
        # Upload data
        csv_content = b"name,platform,year_of_release,genre,publisher,na_sales,eu_sales,jp_sales,other_sales,global_sales,critic_score,critic_count,user_score,user_count,developer,rating\n" \
                      b"Game 1,PS4,2020,Action,Pub 1,1.0,0.5,0.1,0.1,1.7,80,50,8.0,100,Dev 1,M\n" \
                      b"Game 2,PC,2021,RPG,Pub 2,2.0,1.0,0.2,0.2,3.4,90,60,9.0,200,Dev 2,T\n" \
                      b"Game 3,PS4,2021,Action,Pub 1,1.0,1.0,1.0,1.0,4.0,85,55,8.5,150,Dev 1,M\n"
        
        client.post(
            "/api/upload",
            files={"file": ("test_filters.csv", io.BytesIO(csv_content), "text/csv")}
        )
        
        # Test no filters
        response = client.get("/api/data/genre-sales")
        data = response.json()
        assert len(data) == 2 # Action and RPG
        
        # Test genre filter
        response = client.get("/api/data/genre-sales?genre=Action")
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Action"
        assert data[0]["sales"] == 5.7 # 1.7 + 4.0
        
        # Test platform filter
        response = client.get("/api/data/genre-sales?platform=PS4")
        data = response.json()
        assert len(data) == 1 # Only Action on PS4
        assert data[0]["name"] == "Action"
        assert data[0]["sales"] == 5.7
        
        # Test both filters
        response = client.get("/api/data/genre-sales?genre=RPG&platform=PS4")
        data = response.json()
        assert len(data) == 0
        
        # Test filters endpoint
        response = client.get("/api/data/filters")
        filters = response.json()
        assert "Action" in filters["genres"]
        assert "RPG" in filters["genres"]
        assert "PS4" in filters["platforms"]
        assert "PC" in filters["platforms"]

def test_profile_filtering():
    with TestClient(app) as client:
        # Data already uploaded from previous test (if using same engine/session)
        # But lifespan might clear it if not handled. Let's re-upload to be safe.
        csv_content = b"name,platform,year_of_release,genre,publisher,na_sales,eu_sales,jp_sales,other_sales,global_sales,critic_score,critic_count,user_score,user_count,developer,rating\n" \
                      b"Game 1,PS4,2020,Action,Pub 1,1.0,0.5,0.1,0.1,1.7,80,50,8.0,100,Dev 1,M\n" \
                      b"Game 2,PC,2021,RPG,Pub 2,2.0,1.0,0.2,0.2,3.4,90,60,9.0,200,Dev 2,T\n"
        
        client.post(
            "/api/upload",
            files={"file": ("test_profile_filters.csv", io.BytesIO(csv_content), "text/csv")}
        )
        
        # Filter by PS4
        response = client.get("/api/profile?platform=PS4")
        data = response.json()
        assert data["total_games"] == 1
        assert data["total_global_sales"] == 1.7
        
        # Filter by RPG
        response = client.get("/api/profile?genre=RPG")
        data = response.json()
        assert data["total_games"] == 1
        assert data["total_global_sales"] == 3.4
