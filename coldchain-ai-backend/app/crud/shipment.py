# app/crud/shipment.py
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas

def get_shipment(db: Session, shipment_id: int):
    return db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()

def get_shipments(db: Session, skip: int = 0, limit: int = 100):
    # Dùng joinedload để tải kèm thông tin của device, tránh N+1 query
    return db.query(models.Shipment).options(joinedload(models.Shipment.device)).offset(skip).limit(limit).all()

def create_shipment(db: Session, shipment: schemas.ShipmentCreate):
    db_shipment = models.Shipment(
        name=shipment.name,
        device_id=shipment.device_id,
        start_location=shipment.start_location,
        end_location=shipment.end_location,
    )
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment