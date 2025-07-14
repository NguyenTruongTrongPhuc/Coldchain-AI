# app/models/shipment.py
# TODO: Hoàn thiện model này ở các phần sau
from sqlalchemy import Column, Integer, String, Float, DateTime
from ..core.database import Base

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    product_type = Column(String)
    temp_min = Column(Float)
    temp_max = Column(Float)
    start_location = Column(String)
    end_location = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="pending") # pending, in_transit, completed, failed