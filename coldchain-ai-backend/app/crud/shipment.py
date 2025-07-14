# app/crud/shipment.py
# TODO: Hoàn thiện các hàm CRUD này
from sqlalchemy.orm import Session
from .. import models, schemas

def create_shipment(db: Session, shipment: schemas.ShipmentCreate, owner_id: int):
    # Logic để tạo lô hàng mới
    pass

def get_shipments(db: Session, skip: int = 0, limit: int = 100):
    # Logic để lấy danh sách lô hàng
    pass