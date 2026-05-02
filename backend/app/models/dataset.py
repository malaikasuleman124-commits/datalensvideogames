from pydantic import BaseModel, ConfigDict
from typing import Optional
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class GameSaleRecord(Base):
    __tablename__ = "game_sales"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    platform = Column(String, index=True)
    year_of_release = Column(Integer, nullable=True)
    genre = Column(String, index=True)
    publisher = Column(String, nullable=True)
    na_sales = Column(Float, default=0.0)
    eu_sales = Column(Float, default=0.0)
    jp_sales = Column(Float, default=0.0)
    other_sales = Column(Float, default=0.0)
    global_sales = Column(Float, default=0.0)
    critic_score = Column(Float, nullable=True)
    critic_count = Column(Integer, nullable=True)
    user_score = Column(Float, nullable=True)
    user_count = Column(Integer, nullable=True)
    developer = Column(String, nullable=True)
    rating = Column(String, nullable=True)

class VideoGameSale(BaseModel):
    name: str
    platform: str
    year_of_release: Optional[int] = None
    genre: str
    publisher: Optional[str] = None
    na_sales: float = 0.0
    eu_sales: float = 0.0
    jp_sales: float = 0.0
    other_sales: float = 0.0
    global_sales: float = 0.0
    critic_score: Optional[float] = None
    critic_count: Optional[int] = None
    user_score: Optional[float] = None
    user_count: Optional[int] = None
    developer: Optional[str] = None
    rating: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
