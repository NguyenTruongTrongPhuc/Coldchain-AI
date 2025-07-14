# app/models/sensor_data.py
# TODO: Hoàn thiện model này. Tùy thuộc vào việc dùng TimescaleDB hay không.
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from ..core.database import Base

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    device_id = Column(String, ForeignKey("devices.tracker_id"))
    timestamp = Column(DateTime, index=True)
    temperature = Column(Float)
    humidity = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)