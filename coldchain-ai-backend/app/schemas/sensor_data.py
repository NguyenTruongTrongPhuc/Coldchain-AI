# app/schemas/sensor_data.py
# TODO: Hoàn thiện schema này
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorData(BaseModel):
    timestamp: datetime
    temperature: float
    humidity: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        orm_mode = True