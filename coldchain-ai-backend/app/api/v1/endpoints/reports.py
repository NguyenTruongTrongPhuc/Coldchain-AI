# app/api/v1/endpoints/reports.py
import time
import os
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path # <-- Thêm import này

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

from .... import crud, schemas, models
from ....core.database import get_db
from ....core.dependencies import get_current_active_user

router = APIRouter()

# --- SỬA LẠI CÁCH ĐỊNH NGHĨA ĐƯỜNG DẪN ---
# Lấy đường dẫn tuyệt đối đến thư mục gốc của dự án (coldchain-ai-backend)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
REPORTS_DIR = BASE_DIR / "generated_reports"
os.makedirs(REPORTS_DIR, exist_ok=True)
# -------------------------------------------


def generate_report_file(report_id: int, shipment_id: int, db: Session):
    print(f"Bắt đầu tạo báo cáo PDF cho report ID: {report_id}...")

    shipment = crud.shipment.get_shipment(db, shipment_id=shipment_id)
    if not shipment:
        print(f"Không tìm thấy lô hàng với ID: {shipment_id}. Hủy tạo báo cáo.")
        crud.report.update_report_status(db, report_id=report_id, status="failed")
        return

    # Sử dụng đường dẫn tuyệt đối để tạo file
    file_path = REPORTS_DIR / f"report_{report_id}_{shipment.name.replace(' ', '_')}.pdf"

    try:
        c = canvas.Canvas(str(file_path), pagesize=letter)
        width, height = letter

        c.setFont("Helvetica-Bold", 16)
        c.drawString(72, height - 72, f"Báo cáo hành trình - ColdChain-AI")

        c.setFont("Helvetica", 12)
        c.drawString(72, height - 120, f"Mã lô hàng: {shipment.name}")
        c.drawString(72, height - 140, f"Thiết bị Tracker: {shipment.device.tracker_id if shipment.device else 'N/A'}")
        c.drawString(72, height - 160, f"Điểm đi: {shipment.start_location}")
        c.drawString(72, height - 180, f"Điểm đến: {shipment.end_location}")

        c.drawString(72, height - 220, "Nội dung chi tiết hành trình và dữ liệu cảm biến sẽ được thêm ở đây.")

        c.save()

        # Lưu đường dẫn tuyệt đối (dưới dạng string) vào DB
        crud.report.update_report_status(db, report_id=report_id, status="completed", file_path=str(file_path))
        print(f"Đã tạo xong báo cáo PDF cho ID: {report_id} tại '{file_path}'")

    except Exception as e:
        print(f"Lỗi khi tạo file PDF: {e}")
        crud.report.update_report_status(db, report_id=report_id, status="failed")

# ... (Các API endpoint còn lại không cần thay đổi) ...
@router.post("/", response_model=schemas.Report, status_code=202)
def create_new_report(report_in: schemas.ReportCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    report_name = f"Báo cáo {report_in.report_type}"
    if report_in.report_type == 'journey' and report_in.shipment_id:
        shipment = crud.shipment.get_shipment(db, shipment_id=report_in.shipment_id)
        if shipment:
            report_name = f"Báo cáo hành trình cho {shipment.name}"
    db_report = crud.report.create_report(db, user_id=current_user.id, report_name=report_name)
    if report_in.report_type == 'journey' and report_in.shipment_id:
        background_tasks.add_task(generate_report_file, db_report.id, report_in.shipment_id, db)
    else:
        crud.report.update_report_status(db, db_report.id, "failed")
    return db_report

@router.get("/", response_model=List[schemas.Report])
def read_all_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.report.get_reports(db)

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Báo cáo không tồn tại")
    if db_report.status != "completed" or not db_report.file_path:
        raise HTTPException(status_code=400, detail="Báo cáo chưa sẵn sàng hoặc đã bị lỗi")
    if not os.path.exists(db_report.file_path):
        raise HTTPException(status_code=404, detail=f"File báo cáo không được tìm thấy trên server.")
    return FileResponse(path=db_report.file_path, filename=os.path.basename(db_report.file_path))