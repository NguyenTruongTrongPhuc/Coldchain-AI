# app/api/v1/endpoints/devices.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .... import crud, schemas, models
from ....core.database import get_db
from ....core.dependencies import get_current_active_user

router = APIRouter()

@router.post("/", response_model=schemas.Device, status_code=status.HTTP_201_CREATED)
def create_new_device(
    device: schemas.DeviceCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    """Tạo một thiết bị tracker mới."""
    return crud.device.create_device(db=db, device=device)

@router.get("/", response_model=List[schemas.Device])
def read_all_devices(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    connection: Optional[str] = None,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy danh sách thiết bị với bộ lọc và phân trang."""
    devices = crud.device.get_devices(
        db, skip=skip, limit=limit, search=search, connection=connection
    )
    return devices

@router.get("/{device_id}", response_model=schemas.Device)
def read_single_device(
    device_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy thông tin chi tiết một thiết bị."""
    db_device = crud.device.get_device(db, device_id=device_id)
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device

@router.get("/{device_id}/logs", response_model=List[schemas.ActivityLog])
def read_device_logs(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Lấy lịch sử hoạt động của một thiết bị."""
    logs = crud.activity_log.get_logs_for_device(db, device_id=device_id)
    return logs

@router.post("/{device_id}/notes", response_model=schemas.ActivityLog)
def create_note_for_device(
    device_id: int,
    note: schemas.ActivityLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Tạo một ghi chú mới cho thiết bị."""
    return crud.activity_log.create_device_log(db=db, device_id=device_id, log=note)

@router.put("/{device_id}", response_model=schemas.Device)
def update_existing_device(
    device_id: int,
    device_update: schemas.DeviceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Cập nhật một thiết bị đã có."""
    db_device = crud.device.update_device(db, device_id=device_id, device_update=device_update)
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device

@router.delete("/{device_id}", response_model=schemas.Device)
def delete_existing_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Xóa một thiết bị."""
    db_device = crud.device.delete_device(db, device_id=device_id)
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device