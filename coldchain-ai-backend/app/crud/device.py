# app/crud/device.py
from sqlalchemy.orm import Session
from typing import Optional
from .. import models, schemas

def get_device(db: Session, device_id: int) -> Optional[models.Device]:
    """Lấy thông tin một thiết bị theo ID."""
    return db.query(models.Device).filter(models.Device.id == device_id).first()

def get_devices(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    connection: Optional[str] = None
) -> list[models.Device]:
    """
    Lấy danh sách thiết bị với bộ lọc và phân trang.
    """
    query = db.query(models.Device)

    # Áp dụng bộ lọc tìm kiếm
    if search:
        query = query.filter(
            (models.Device.name.ilike(f"%{search}%")) |
            (models.Device.tracker_id.ilike(f"%{search}%"))
        )
    
    # Áp dụng bộ lọc trạng thái
    if connection:
        query = query.filter(models.Device.connection == connection)

    return query.offset(skip).limit(limit).all()

def create_device(db: Session, device: schemas.DeviceCreate) -> models.Device:
    """Tạo một thiết bị mới."""
    db_device = models.Device(**device.model_dump())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device_id: int, device_update: schemas.DeviceUpdate) -> Optional[models.Device]:
    """Cập nhật thông tin một thiết bị."""
    db_device = get_device(db, device_id=device_id)
    if db_device:
        # Lấy dữ liệu từ schema và loại bỏ các giá trị None
        update_data = device_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_device, key, value)
        db.commit()
        db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int) -> Optional[models.Device]:
    """Xóa một thiết bị."""
    db_device = get_device(db, device_id=device_id)
    if db_device:
        db.delete(db_device)
        db.commit()
    return db_device