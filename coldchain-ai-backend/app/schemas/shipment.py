# app/schemas/shipment.py
from typing import Optional
from pydantic import BaseModel
from .device import Device # Import schema Device để lồng vào

class ShipmentBase(BaseModel):
    name: str
    start_location: Optional[str] = None
    end_location: Optional[str] = None

class ShipmentCreate(ShipmentBase):
    device_id: int # Khi tạo, chỉ cần truyền ID của thiết bị

class ShipmentUpdate(ShipmentBase):
    pass

class Shipment(ShipmentBase):
    id: int
    status: str
    device: Optional[Device] = None # Trả về toàn bộ thông tin device đã được gán

    class Config:
        from_attributes = True