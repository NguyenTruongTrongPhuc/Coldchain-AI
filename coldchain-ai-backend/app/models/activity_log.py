# app/models/activity_log.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship # <-- Thêm import này
from ..core.database import Base

class DeviceActivityLog(Base):
    __tablename__ = "device_activity_logs"

    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    log_type = Column(String, default="system")
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Thêm dòng relationship còn thiếu ở đây
    device = relationship("Device", back_populates="activity_logs") 