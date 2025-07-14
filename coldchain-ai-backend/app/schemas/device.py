# app/schemas/device.py
# TODO: Hoàn thiện schema này
from typing import Optional
from pydantic import BaseModel

class DeviceBase(BaseModel):
    tracker_id: str
    name: Optional[str] = None
    status: Optional[str] = "inactive"
    battery_level: Optional[float] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    class Config:
        orm_mode = True