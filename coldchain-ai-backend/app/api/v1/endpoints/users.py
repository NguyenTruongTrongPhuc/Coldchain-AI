# app/api/v1/endpoints/users.py
# TODO: Hoàn thiện các endpoint quản lý user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .... import crud, schemas
from ....core.database import get_db
from ....core.dependencies import get_current_active_user
from .... import crud, schemas, models

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    """
    Lấy danh sách người dùng (yêu cầu quyền admin).
    """
    # TODO: Thêm logic kiểm tra quyền admin
    # users = crud.user.get_users(db, skip=skip, limit=limit)
    # return users
    pass