import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from app.models.dataset import GameSaleRecord
from app.services.data_manager import SessionLocal

class Forecaster:
    @staticmethod
    def get_forecast_data(filters: dict = None):
        db = SessionLocal()
        try:
            query = db.query(GameSaleRecord)
            
            if filters:
                if filters.get("genre"):
                    query = query.filter(GameSaleRecord.genre == filters["genre"])
                if filters.get("platform"):
                    query = query.filter(GameSaleRecord.platform == filters["platform"])
            
            records = query.all()
            if not records:
                return []

            # Group by year and sum global sales
            data = {}
            for r in records:
                if r.year_of_release:
                    year = int(r.year_of_release)
                    data[year] = data.get(year, 0) + r.global_sales
            
            if len(data) < 2:
                return [{"year": y, "sales": s, "is_predicted": False} for y, s in sorted(data.items())]

            years = sorted(data.keys())
            sales = [data[y] for y in years]
            
            # Simple Linear Regression: y = mx + c
            # Using numpy for the fit
            x = np.array(years)
            y = np.array(sales)
            
            m, c = np.polyfit(x, y, 1)
            
            # Historical data
            result = []
            for y_val, s_val in zip(years, sales):
                result.append({
                    "year": int(y_val),
                    "sales": round(float(s_val), 2),
                    "is_predicted": False
                })
            
            # Forecast next 5 years
            last_year = max(years)
            for i in range(1, 6):
                next_year = last_year + i
                predicted_sales = m * next_year + c
                # Ensure we don't predict negative sales
                predicted_sales = max(0, predicted_sales)
                
                result.append({
                    "year": int(next_year),
                    "sales": round(float(predicted_sales), 2),
                    "is_predicted": True
                })
            
            return result
        finally:
            db.close()
