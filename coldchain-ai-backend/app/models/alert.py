# app/models/alert.py
# TODO: Hoàn thiện model này ở các phần sau
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from ..core.database import Base

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    alert_type = Column(String) # e.g., "temperature_exceeded", "shock_detected", "predictive"
    message = Column(String)
    timestamp = Column(DateTime)
    priority = Column(String, default="medium") # low, medium, high, critical
    status = Column(String, default="new") # new, acknowledged, resolved