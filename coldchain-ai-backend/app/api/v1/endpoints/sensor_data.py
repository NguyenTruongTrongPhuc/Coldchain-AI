# app/api/v1/endpoints/sensor_data.py
# TODO: Hoàn thiện endpoint này, ví dụ endpoint nhận dữ liệu từ IoT Platform
from fastapi import APIRouter

router = APIRouter()

@router.post("/ingest")
def ingest_sensor_data():
    """
    Endpoint này có thể được coreIoT (ThingsBoard) gọi tới thông qua webhook.
    """
    pass