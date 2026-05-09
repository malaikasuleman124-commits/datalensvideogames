from mcp.server.fastmcp import FastMCP
from sqlalchemy import func
from app.services.data_manager import SessionLocal
from app.models.dataset import GameSaleRecord

mcp = FastMCP("DataLens")

@mcp.tool()
def get_top_selling_games(limit: int = 5) -> list[dict]:
    """
    Returns the top best-selling games globally from the dataset.
    Args:
        limit: The number of games to return (default 5).
    """
    db = SessionLocal()
    try:
        results = db.query(GameSaleRecord).order_by(GameSaleRecord.global_sales.desc()).limit(limit).all()
        return [{"name": r.name, "platform": r.platform, "year": r.year_of_release, "global_sales": r.global_sales} for r in results]
    finally:
        db.close()

@mcp.tool()
def get_genre_distribution() -> list[dict]:
    """
    Returns total global sales aggregated by game genre.
    """
    db = SessionLocal()
    try:
        results = db.query(
            GameSaleRecord.genre,
            func.sum(GameSaleRecord.global_sales).label("total_sales")
        ).group_by(GameSaleRecord.genre).order_by(func.sum(GameSaleRecord.global_sales).desc()).all()
        return [{"genre": r.genre, "total_global_sales": round(float(r.total_sales), 2)} for r in results if r.genre]
    finally:
        db.close()

@mcp.tool()
def get_platform_stats() -> list[dict]:
    """
    Returns total global sales aggregated by platform.
    """
    db = SessionLocal()
    try:
        results = db.query(
            GameSaleRecord.platform,
            func.sum(GameSaleRecord.global_sales).label("total_sales")
        ).group_by(GameSaleRecord.platform).order_by(func.sum(GameSaleRecord.global_sales).desc()).all()
        return [{"platform": r.platform, "total_global_sales": round(float(r.total_sales), 2)} for r in results if r.platform]
    finally:
        db.close()

@mcp.tool()
def get_sales_over_time() -> list[dict]:
    """
    Returns total global sales aggregated by year of release.
    """
    db = SessionLocal()
    try:
        results = db.query(
            GameSaleRecord.year_of_release,
            func.sum(GameSaleRecord.global_sales).label("total_sales")
        ).filter(GameSaleRecord.year_of_release != None).group_by(GameSaleRecord.year_of_release).order_by(GameSaleRecord.year_of_release).all()
        return [{"year": int(r.year_of_release), "sales": round(r.total_sales, 2)} for r in results]
    finally:
        db.close()
