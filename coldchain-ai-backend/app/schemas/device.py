# app/schemas/device.py
from typing import Optional
from pydantic import BaseModel

# Schema cơ sở, chứa các trường chung
class DeviceBase(BaseModel):
    tracker_id: str
    name: Optional[str] = None
    last_location: Optional[str] = None
    battery: Optional[float] = None

# Schema dùng khi tạo mới một thiết bị
class DeviceCreate(DeviceBase):
    pass

# Schema dùng khi cập nhật một thiết bị
class DeviceUpdate(DeviceBase):
    pass

# Schema dùng để trả về dữ liệu từ API
class Device(DeviceBase):
    id: int
    status: str
    connection: str

    class Config:
        from_attributes = True