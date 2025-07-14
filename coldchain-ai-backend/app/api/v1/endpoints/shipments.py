# app/api/v1/endpoints/shipments.py
# TODO: Hoàn thiện các endpoint quản lý lô hàng
from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def create_shipment():
    pass

@router.get("/{shipment_id}")
def read_shipment_details(shipment_id: int):
    pass