# app/api/v1/routers.py
# Aggregates all endpoint routers

from fastapi import APIRouter
from .endpoints import auth, users, devices, shipments, sensor_data, alerts, ai_gateway, reports

api_router = APIRouter()

# Bao gồm tất cả các router của từng module
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(devices.router, prefix="/devices", tags=["Devices"])
api_router.include_router(shipments.router, prefix="/shipments", tags=["Shipments"])
api_router.include_router(sensor_data.router, prefix="/sensor-data", tags=["Sensor Data"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(ai_gateway.router, prefix="/ai", tags=["AI Gateway"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])