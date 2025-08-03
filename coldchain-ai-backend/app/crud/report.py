# app/crud/report.py
from sqlalchemy.orm import Session
from .. import models, schemas

def create_report(db: Session, user_id: int, report_name: str) -> models.Report:
    db_report = models.Report(name=report_name, user_id=user_id)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_reports(db: Session, skip: int = 0, limit: int = 100) -> list[models.Report]:
    return db.query(models.Report).order_by(models.Report.created_at.desc()).offset(skip).limit(limit).all()

def update_report_status(db: Session, report_id: int, status: str, file_path: str = None):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if db_report:
        db_report.status = status
        db_report.file_path = file_path
        db.commit()
    return db_report