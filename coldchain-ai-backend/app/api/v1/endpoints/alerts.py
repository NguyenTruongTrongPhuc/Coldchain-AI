# app/api/v1/endpoints/alerts.py
# TODO: Hoàn thiện các endpoint quản lý cảnh báo
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_alerts():
    pass