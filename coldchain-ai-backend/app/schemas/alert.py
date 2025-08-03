# app/schemas/alert.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    alert_type: str
    message: str
    priority: str

# Schema mới để nhận ghi chú xử lý từ frontend
class AlertResolve(BaseModel):
    resolution_note: str

class Alert(AlertBase):
    id: int
    shipment_id: int
    timestamp: datetime
    status: str
    resolution_note: Optional[str] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True