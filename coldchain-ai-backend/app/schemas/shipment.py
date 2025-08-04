# app/schemas/shipment.py
from typing import Optional
from pydantic import BaseModel
from .device import Device

class ShipmentBase(BaseModel):
    name: str
    start_location: Optional[str] = None
    end_location: Optional[str] = None

class ShipmentCreate(ShipmentBase):
    device_id: int
    # Thêm trường tọa độ khi tạo mới
    start_lat: float
    start_lng: float

class ShipmentUpdate(ShipmentBase):
    status: Optional[str] = None

class Shipment(ShipmentBase):
    id: int
    status: str
    device: Optional[Device] = None
    # Thêm trường tọa độ khi trả về
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None

    class Config:
        from_attributes = True