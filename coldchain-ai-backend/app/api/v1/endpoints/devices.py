# app/api/v1/endpoints/devices.py
# TODO: Hoàn thiện các endpoint quản lý thiết bị
from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def create_device():
    pass

@router.get("/")
def read_devices():
    pass