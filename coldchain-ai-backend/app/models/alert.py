# app/models/alert.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    alert_type = Column(String, nullable=False)
    message = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    priority = Column(String, default="medium")
    
    # --- CÁC CỘT MỚI ---
    status = Column(String, default="active")  # active, resolved
    resolution_note = Column(Text, nullable=True)
    resolved_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Mối quan hệ
    shipment = relationship("Shipment", back_populates="alerts")