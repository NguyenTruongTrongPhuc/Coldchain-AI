# app/crud/device.py
# TODO: Hoàn thiện các hàm CRUD này
from sqlalchemy.orm import Session
from .. import models, schemas

def get_device(db: Session, device_id: int):
    # Logic để lấy thiết bị theo ID
    pass

def get_device_by_tracker_id(db: Session, tracker_id: str):
    # Logic để lấy thiết bị theo Tracker ID
    pass

def get_devices(db: Session, skip: int = 0, limit: int = 100):
    # Logic để lấy danh sách thiết bị
    pass

def create_device(db: Session, device: schemas.DeviceCreate):
    # Logic để tạo thiết bị mới
    pass