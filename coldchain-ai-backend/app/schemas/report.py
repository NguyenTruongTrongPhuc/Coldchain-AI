# app/schemas/report.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    name: str

class ReportCreate(BaseModel):
    # Các tham số để tạo báo cáo, ví dụ:
    report_type: str
    shipment_id: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class Report(ReportBase):
    id: int
    status: str
    file_path: Optional[str] = None
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True