# app/api/v1/endpoints/reports.py
# TODO: Hoàn thiện các endpoint tạo và truy xuất báo cáo
from fastapi import APIRouter

router = APIRouter()

@router.get("/{shipment_id}")
def get_digital_journey_log(shipment_id: int):
    pass