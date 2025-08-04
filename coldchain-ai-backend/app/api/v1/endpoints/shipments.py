# app/api/v1/endpoints/shipments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

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
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy danh sách các lô hàng với bộ lọc và tìm kiếm."""
    shipments = crud.shipment.get_shipments(
        db, skip=skip, limit=limit, search=search, status=status
    )
    return shipments

@router.put("/{shipment_id}", response_model=schemas.Shipment)
def update_existing_shipment(
    shipment_id: int,
    shipment_update: schemas.ShipmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Cập nhật thông tin một lô hàng."""
    db_shipment = crud.shipment.update_shipment(
        db, shipment_id=shipment_id, shipment_update=shipment_update
    )
    if not db_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return db_shipment

@router.get("/{shipment_id}/simulated_route", response_model=List[List[float]])
def get_simulated_route(shipment_id: int, db: Session = Depends(get_db)):
    """
    Tạo ra một lộ trình mẫu. Trong thực tế, đây sẽ là dữ liệu từ DB.
    """
    shipment = crud.shipment.get_shipment(db, shipment_id=shipment_id)
    if not shipment or not shipment.current_lat or not shipment.current_lng:
        raise HTTPException(status_code=404, detail="Không có dữ liệu vị trí cho lô hàng")

    start_lat, start_lng = shipment.current_lat, shipment.current_lng
    # Tạo 3 điểm ngẫu nhiên xung quanh điểm bắt đầu
    route = [
        [start_lat, start_lng],
        [start_lat + 0.05, start_lng - 0.05],
        [start_lat + 0.1, start_lng + 0.02],
        [start_lat + 0.08, start_lng + 0.08],
    ]
    return route