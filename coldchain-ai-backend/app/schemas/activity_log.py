# app/schemas/activity_log.py
from pydantic import BaseModel
from datetime import datetime

class ActivityLogBase(BaseModel):
    content: str

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLog(ActivityLogBase):
    id: int
    timestamp: datetime
    log_type: str
    user_id: int | None = None

    class Config:
        from_attributes = True