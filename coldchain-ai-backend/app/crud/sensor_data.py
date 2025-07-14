# app/crud/sensor_data.py
# TODO: Hoàn thiện các hàm CRUD này
from sqlalchemy.orm import Session

def create_sensor_data(db: Session, data: dict):
    # Logic để lưu dữ liệu cảm biến mới
    pass

def get_sensor_data_for_shipment(db: Session, shipment_id: int):
    # Logic để lấy dữ liệu cảm biến cho một lô hàng
    pass