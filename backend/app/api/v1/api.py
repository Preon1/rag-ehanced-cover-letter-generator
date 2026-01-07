from fastapi import APIRouter
from app.api.v1.endpoints import letter,auth,user

api_router = APIRouter()

# Include letter endpoints
api_router.include_router(
    letter.router,
    prefix="/letter",
    tags=["letter"]
)
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)
api_router.include_router(
    user.router,
    prefix="/user",
    tags=["user"]
)