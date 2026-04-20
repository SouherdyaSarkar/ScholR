from fastapi import APIRouter, UploadFile, File
from fileHandler import file_handler

fileRouter = APIRouter()

@fileRouter.post("/upload")
async def upload_file(userID: str, topic : str, file: UploadFile = File(...)):
    if not file:
        return {"status": "error", "message": "No file provided"}
    return await file_handler.uploadFile(userID, topic, file)