# app/schemas/__init__.py

from .token import Token, TokenData
from .user import User, UserCreate, UserUpdate, UserInDB
from .device import Device, DeviceCreate, DeviceUpdate
from .shipment import Shipment, ShipmentCreate, ShipmentUpdate
from .alert import Alert, AlertResolve
from .sensor_data import SensorData
from .activity_log import ActivityLog, ActivityLogCreate
from .report import Report, ReportCreate