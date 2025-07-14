# app/schemas/alert.py
# TODO: Hoàn thiện schema này
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    alert_type: str
    message: str
    priority: str

class Alert(AlertBase):
    id: int
    shipment_id: int
    timestamp: datetime
    status: str

    class Config:
        orm_mode = True