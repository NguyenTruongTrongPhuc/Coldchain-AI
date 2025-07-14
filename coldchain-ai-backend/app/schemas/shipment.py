# app/schemas/shipment.py
# TODO: Hoàn thiện schema này
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ShipmentBase(BaseModel):
    name: str
    product_type: Optional[str] = None
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None

class ShipmentCreate(ShipmentBase):
    device_tracker_id: str # ID của tracker được gán vào lô hàng

class Shipment(ShipmentBase):
    id: int
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    
    class Config:
        orm_mode = True