# app/api/v1/endpoints/shipments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .... import crud, schemas, models
from ....core.database import get_db
from ....core.dependencies import get_current_active_user

router = APIRouter()

@router.post("/", response_model=schemas.Shipment, status_code=status.HTTP_201_CREATED)
def create_new_shipment(
    shipment: schemas.ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Tạo một lô hàng mới và gán nó cho một thiết bị."""
    # Kiểm tra xem device có tồn tại không
    db_device = crud.device.get_device(db, device_id=shipment.device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail=f"Device with id {shipment.device_id} not found")
    
    return crud.shipment.create_shipment(db=db, shipment=shipment)

@router.get("/", response_model=List[schemas.Shipment])
def read_all_shipments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy danh sách các lô hàng."""
    shipments = crud.shipment.get_shipments(db, skip=skip, limit=limit)
    return shipments