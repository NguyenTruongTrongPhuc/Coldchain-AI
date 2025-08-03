# app/models/report.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)
    status = Column(String, default="processing")  # processing, completed, failed
    file_path = Column(String, nullable=True) # Đường dẫn tới file đã tạo
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))