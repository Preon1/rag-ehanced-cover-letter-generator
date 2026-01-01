from fastapi import APIRouter
from app.api.v1.endpoints import letter

api_router = APIRouter()

# Include letter endpoints
api_router.include_router(
    letter.router,
    prefix="/letter",
    tags=["letter"]
)
