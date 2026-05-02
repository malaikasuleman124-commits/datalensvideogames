from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from app.services.data_manager import parse_and_store_csv

router = APIRouter(prefix="/api/upload", tags=["Upload"])

MAX_FILE_SIZE = 50 * 1024 * 1024 # 50 MB

@router.post("")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    # Read file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 50MB limit.")
        
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        inserted_rows = parse_and_store_csv(temp_file_path)
        return {"message": "Dataset uploaded and processed successfully.", "rows_inserted": inserted_rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
