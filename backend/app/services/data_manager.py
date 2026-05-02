import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.dataset import Base, GameSaleRecord

DATABASE_URL = "sqlite:///./datalens.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def parse_and_store_csv(file_path: str):
    """Parses a CSV file and stores the data in SQLite."""
    # Read CSV
    df = pd.read_csv(file_path)
    
    # Map column names to lowercase to match our model
    df.columns = [c.lower() for c in df.columns]
    
    # Handle NaNs to insert NULL into db instead of float('nan')
    df = df.where(pd.notnull(df), None)

    db = SessionLocal()
    try:
        records = []
        for _, row in df.iterrows():
            record = GameSaleRecord(
                name=row.get('name'),
                platform=row.get('platform'),
                year_of_release=row.get('year_of_release'),
                genre=row.get('genre'),
                publisher=row.get('publisher'),
                na_sales=row.get('na_sales', 0.0),
                eu_sales=row.get('eu_sales', 0.0),
                jp_sales=row.get('jp_sales', 0.0),
                other_sales=row.get('other_sales', 0.0),
                global_sales=row.get('global_sales', 0.0),
                critic_score=row.get('critic_score'),
                critic_count=row.get('critic_count'),
                user_score=row.get('user_score') if row.get('user_score') != 'tbd' else None,
                user_count=row.get('user_count'),
                developer=row.get('developer'),
                rating=row.get('rating')
            )
            # Sometimes user_score is 'tbd', convert to float if possible
            try:
                if record.user_score is not None:
                    record.user_score = float(record.user_score)
            except ValueError:
                record.user_score = None
                
            records.append(record)
        
        # Clear existing data for a fresh dataset each upload
        db.query(GameSaleRecord).delete()
        db.add_all(records)
        db.commit()
        return len(records)
    finally:
        db.close()
