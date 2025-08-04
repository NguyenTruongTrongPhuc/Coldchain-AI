# app/crud/shipment.py
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from .. import models, schemas

def get_shipment(db: Session, shipment_id: int):
    return db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()

def get_shipments(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None
) -> list[models.Shipment]:
    """
    Lấy danh sách lô hàng với bộ lọc và tìm kiếm.
    """
    query = db.query(models.Shipment).options(joinedload(models.Shipment.device))

    if search:
        # Tìm kiếm theo tên lô hàng hoặc mã tracker của thiết bị
        query = query.join(models.Device).filter(
            (models.Shipment.name.ilike(f"%{search}%")) |
            (models.Device.tracker_id.ilike(f"%{search}%"))
        )
    
    if status:
        query = query.filter(models.Shipment.status == status)

    return query.order_by(models.Shipment.id.desc()).offset(skip).limit(limit).all()

def create_shipment(db: Session, shipment: schemas.ShipmentCreate):
    db_shipment = models.Shipment(
        name=shipment.name,
        device_id=shipment.device_id,
        start_location=shipment.start_location,
        end_location=shipment.end_location,
        # Lưu vị trí ban đầu
        current_lat=shipment.start_lat,
        current_lng=shipment.start_lng
    )
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def update_shipment(db: Session, shipment_id: int, shipment_update: schemas.ShipmentUpdate):
    db_shipment = get_shipment(db, shipment_id=shipment_id)
    if db_shipment:
        update_data = shipment_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_shipment, key, value)
        db.commit()
        db.refresh(db_shipment)
    return db_shipment