# app/crud/alert.py
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List
from .. import models, schemas

def get_alerts(
    db: Session, 
    status: str, 
    priorities: List[str] = None,
    alert_types: List[str] = None,
    start_date: date = None,
    end_date: date = None,
    shipment_id: int = None,
    skip: int = 0, 
    limit: int = 100
):
    """Lấy danh sách cảnh báo với bộ lọc nâng cao."""
    query = db.query(models.Alert).filter(models.Alert.status == status)

    if priorities:
        query = query.filter(models.Alert.priority.in_(priorities))
    if alert_types:
        query = query.filter(models.Alert.alert_type.in_(alert_types))
    if start_date:
        query = query.filter(models.Alert.timestamp >= start_date)
    if end_date:
        # Thêm 1 ngày để bao gồm cả ngày kết thúc
        from datetime import timedelta
        query = query.filter(models.Alert.timestamp < end_date + timedelta(days=1))
    if shipment_id:
        query = query.filter(models.Alert.shipment_id == shipment_id)

    return query.order_by(models.Alert.timestamp.desc()).offset(skip).limit(limit).all()

def resolve_alert(db: Session, alert_id: int, note: str, user_id: int):
    """Đánh dấu một cảnh báo là đã xử lý."""
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if db_alert:
        db_alert.status = "resolved"
        db_alert.resolution_note = note
        db_alert.resolved_by_user_id = user_id
        db_alert.resolved_at = datetime.utcnow()
        db.commit()
        db.refresh(db_alert)
    return db_alert

# Thêm các hàm create_alert, get_alert_by_id... khi cần