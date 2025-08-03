# app/models/shipment.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    status = Column(String, default="pending") # pending, in_transit, completed, failed
    start_location = Column(String, nullable=True)
    end_location = Column(String, nullable=True)

    # Mối quan hệ: Một lô hàng được gán cho MỘT thiết bị
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    device = relationship("Device", back_populates="shipments")
    
    alerts = relationship("Alert", back_populates="shipment")