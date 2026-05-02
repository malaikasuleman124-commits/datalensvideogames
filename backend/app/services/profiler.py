import pandas as pd
from app.services.data_manager import engine

def get_data_profile(genre: str = None, platform: str = None):
    """
    Reads the 'game_sales' table into a Pandas DataFrame
    and computes high-level profiling metrics with optional filtering.
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
                "total_global_sales": 0.0
            }
            
        metrics = {
            "total_games": int(len(df)),
            "min_year": int(df['year_of_release'].min()) if not pd.isna(df['year_of_release'].min()) else None,
            "max_year": int(df['year_of_release'].max()) if not pd.isna(df['year_of_release'].max()) else None,
            "total_global_sales": round(float(df['global_sales'].sum()), 2)
        }
        return metrics
    except Exception as e:
        # If table doesn't exist yet or other error occurs
        return {
            "total_games": 0,
            "min_year": None,
            "max_year": None,
            "total_global_sales": 0.0
        }
