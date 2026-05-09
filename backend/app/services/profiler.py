import pandas as pd
import numpy as np
from app.services.data_manager import engine

def get_data_profile(genre: str = None, platform: str = None):
    """
    Reads the 'game_sales' table into a Pandas DataFrame
    and computes high-level profiling metrics with optional filtering,
    including detailed column-level statistics.
    """
    try:
        # Load data from SQLite
        df = pd.read_sql_table('game_sales', con=engine)
        
        # Apply filters
        if genre:
            df = df[df['genre'] == genre]
        if platform:
            df = df[df['platform'] == platform]
            
        if df.empty:
            return {
                "total_games": 0,
                "min_year": None,
                "max_year": None,
                "total_global_sales": 0.0,
                "columns": []
            }
            
        metrics = {
            "total_games": int(len(df)),
            "min_year": int(df['year_of_release'].min()) if not pd.isna(df['year_of_release'].min()) else None,
            "max_year": int(df['year_of_release'].max()) if not pd.isna(df['year_of_release'].max()) else None,
            "total_global_sales": round(float(df['global_sales'].sum()), 2),
            "columns": []
        }
        
        for col in df.columns:
            if col == 'id':
                continue
                
            col_data = df[col]
            null_count = int(col_data.isnull().sum())
            
            # Determine type
            if pd.api.types.is_numeric_dtype(col_data):
                col_type = "numeric"
                # Calculate outliers using IQR
                Q1 = col_data.quantile(0.25)
                Q3 = col_data.quantile(0.75)
                IQR = Q3 - Q1
                outliers = int(((col_data < (Q1 - 1.5 * IQR)) | (col_data > (Q3 + 1.5 * IQR))).sum())
                
                stats = {
                    "min": float(col_data.min()) if not pd.isna(col_data.min()) else None,
                    "max": float(col_data.max()) if not pd.isna(col_data.max()) else None,
                    "mean": float(col_data.mean()) if not pd.isna(col_data.mean()) else None,
                    "median": float(col_data.median()) if not pd.isna(col_data.median()) else None,
                    "std": float(col_data.std()) if not pd.isna(col_data.std()) else None,
                    "outliers": outliers
                }
            else:
                col_type = "categorical"
                unique_count = int(col_data.nunique())
                stats = {
                    "unique": unique_count
                }
                
            metrics["columns"].append({
                "name": col,
                "type": col_type,
                "null_count": null_count,
                "stats": stats
            })
            
        return metrics
    except Exception as e:
        # If table doesn't exist yet or other error occurs
        return {
            "total_games": 0,
            "min_year": None,
            "max_year": None,
            "total_global_sales": 0.0,
            "columns": []
        }
