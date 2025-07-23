# app/models/device.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    tracker_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True)
    status = Column(String, default="active") # active, inactive, maintenance
    connection = Column(String, default="disconnected") # connected, disconnected
    last_location = Column(String, nullable=True)
    battery = Column(Float, nullable=True)
    
    # Mối quan hệ: Một thiết bị có thể được gán cho nhiều lô hàng (theo thời gian)
    shipments = relationship("Shipment", back_populates="device")
    
    activity_logs = relationship("DeviceActivityLog", back_populates="device")