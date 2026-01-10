import logging

from fastapi import APIRouter, Depends, Request,HTTPException

from app.api.v1.endpoints.user import get_cv_service
from app.services.cv import CVService
from app.services.user import UserService
from app.api.v1.endpoints.user import get_user_service
from backend.app.schemas.letter import GeneralResponse


logger = logging.getLogger(__name__)
router = APIRouter()

@router.delete("/{cv_id}")
async def delete_cv(
    cv_id: int,
    request: Request,
    user_service:UserService = Depends(get_user_service),
    cv_service:CVService = Depends(get_cv_service)
    ):
    pass