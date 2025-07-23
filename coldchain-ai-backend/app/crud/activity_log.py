# app/crud/activity_log.py
from sqlalchemy.orm import Session
from .. import models, schemas

def get_logs_for_device(db: Session, device_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.DeviceActivityLog).filter(models.DeviceActivityLog.device_id == device_id).order_by(models.DeviceActivityLog.timestamp.desc()).offset(skip).limit(limit).all()

def create_device_log(db: Session, device_id: int, log: schemas.ActivityLogCreate):
    db_log = models.DeviceActivityLog(
        content=log.content, 
        device_id=device_id,
        log_type='user_note' # Mặc định là ghi chú của người dùng
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log