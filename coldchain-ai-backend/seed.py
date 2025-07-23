import logging
from app.core.database import SessionLocal, engine, Base
# Dòng import này sẽ đảm bảo SQLAlchemy "biết" về tất cả các model của bạn
# bằng cách chạy qua file __init__.py trong thư mục models
from app.models import User, Device, Shipment, DeviceActivityLog, Alert 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dữ liệu mẫu
devices_to_seed = [
    { "tracker_id": "TRACKER-SG-01", "name": "Xe tải chở Vắc-xin", "last_location": "Quận 1, TP.HCM", "battery": 95, "connection": "connected", "status": "active" },
    { "tracker_id": "TRACKER-DN-02", "name": "Container Lạnh 02", "last_location": "Hải Châu, Đà Nẵng", "battery": 78, "connection": "connected", "status": "active" },
    { "tracker_id": "TRACKER-HN-03", "name": "Thùng hàng B05", "last_location": "Hoàn Kiếm, Hà Nội", "battery": 15, "connection": "disconnected", "status": "inactive" },
    { "tracker_id": "TRACKER-CT-04", "name": "Xe đông lạnh 29C-67890", "last_location": "Ninh Kiều, Cần Thơ", "battery": 55, "connection": "connected", "status": "active" },
    { "tracker_id": "TRACKER-HN-05", "name": "Container C7", "last_location": "Cầu Giấy, Hà Nội", "battery": 82, "connection": "disconnected", "status": "active" },
    { "tracker_id": "TRACKER-HP-06", "name": "Tàu chở hàng 06", "last_location": "Cảng Hải Phòng", "battery": 100, "connection": "connected", "status": "active" },
    { "tracker_id": "TRACKER-SG-07", "name": "Xe tải nhỏ SG-07", "last_location": "Kho Thủ Đức, TP.HCM", "battery": 0, "connection": "disconnected", "status": "maintenance" },
    { "tracker_id": "TRACKER-DN-08", "name": "Thùng hàng D11", "last_location": "Sơn Trà, Đà Nẵng", "battery": 45, "connection": "connected", "status": "active" },
]

def seed_data():
    db = SessionLocal()
    try:
        logger.info("Kiểm tra dữ liệu thiết bị hiện có...")
        existing_devices = db.query(Device).count()
        if existing_devices > 0:
            logger.warning("Database đã có dữ liệu. Bỏ qua seeding.")
            return

        logger.info("Bắt đầu thêm dữ liệu mẫu cho thiết bị...")
        for device_data in devices_to_seed:
            device = Device(**device_data)
            db.add(device)
        
        db.commit()
        logger.info("Thêm dữ liệu mẫu thành công!")

    except Exception as e:
        logger.error(f"Lỗi khi thêm dữ liệu mẫu: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Đang xóa và tạo lại tất cả các bảng...")
    # Xóa tất cả bảng cũ và tạo lại từ đầu để đảm bảo đồng bộ
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    logger.info("Tạo bảng thành công.")
    
    # Thêm dữ liệu mẫu
    seed_data()
    
