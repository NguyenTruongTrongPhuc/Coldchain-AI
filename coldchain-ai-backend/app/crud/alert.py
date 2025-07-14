# app/crud/alert.py
# TODO: Hoàn thiện các hàm CRUD này
from sqlalchemy.orm import Session

def create_alert(db: Session, alert_data: dict):
    # Logic để tạo cảnh báo mới
    pass

def get_alerts_for_shipment(db: Session, shipment_id: int):
    # Logic để lấy cảnh báo cho một lô hàng
    pass