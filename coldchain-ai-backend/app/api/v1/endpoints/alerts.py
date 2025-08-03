# app/api/v1/endpoints/alerts.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from .... import crud, schemas, models
from ....core.database import get_db
from ....core.dependencies import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Alert])
def read_alerts_by_status(
    status: str = "active",
    priorities: Optional[List[str]] = Query(None),
    alert_types: Optional[List[str]] = Query(None),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    shipment_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy danh sách cảnh báo theo trạng thái và các bộ lọc nâng cao."""
    alerts = crud.alert.get_alerts(
        db, 
        status=status, 
        priorities=priorities,
        alert_types=alert_types,
        start_date=start_date,
        end_date=end_date,
        shipment_id=shipment_id
    )
    return alerts

@router.post("/{alert_id}/resolve", response_model=schemas.Alert)
def resolve_an_alert(
    alert_id: int,
    alert_resolve: schemas.AlertResolve,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Đánh dấu một cảnh báo là đã được xử lý."""
    db_alert = crud.alert.resolve_alert(
        db, alert_id=alert_id, note=alert_resolve.resolution_note, user_id=current_user.id
    )
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return db_alert