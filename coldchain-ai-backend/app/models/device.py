# app/models/device.py
# TODO: Hoàn thiện model này ở các phần sau
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    tracker_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True)
    status = Column(String, default="inactive") # ví dụ: active, inactive, maintenance
    battery_level = Column(Float)
    
    # Mối quan hệ với Lô hàng (Một thiết bị có thể được gán cho nhiều lô hàng theo thời gian)
    # shipments = relationship("Shipment", back_populates="device")