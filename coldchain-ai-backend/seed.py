import logging
from datetime import datetime, timedelta
import random

from app.core.database import SessionLocal, engine, Base
from app.models import User, Device, Shipment, Alert, Report
from app.core.security import get_password_hash

# Cấu hình logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def seed_data():
    db = SessionLocal()
    try:
        # --- 1. TẠO USER MẪU ---
        if db.query(User).count() == 0:
            logger.info("Đang tạo user mẫu...")
            users_to_seed = [
                User(email="admin@example.com", full_name="Admin User", hashed_password=get_password_hash("password")),
                User(email="manager@example.com", full_name="Manager User", hashed_password=get_password_hash("password")),
            ]
            db.add_all(users_to_seed)
            db.commit()
            logger.info("Tạo 2 user mẫu thành công (mật khẩu là 'password').")
        
        all_users = db.query(User).all()
        admin_user = all_users[0]

        # --- 2. TẠO DEVICE MẪU ---
        if db.query(Device).count() == 0:
            logger.info("Bắt đầu thêm dữ liệu mẫu cho thiết bị...")
            devices_to_seed = []
            for i in range(1, 16):
                devices_to_seed.append(
                    Device(
                        tracker_id=f"TRK-2025-{i:03d}",
                        name=f"Thiết bị {random.choice(['Xe tải', 'Container', 'Thùng hàng'])} {i}",
                        battery=random.randint(5, 100),
                        connection=random.choice(["connected", "disconnected"]),
                        status=random.choice(["active", "inactive", "maintenance"]),
                        last_location=random.choice(["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ"])
                    )
                )
            db.add_all(devices_to_seed)
            db.commit()
            logger.info(f"Thêm {len(devices_to_seed)} thiết bị mẫu thành công!")
        
        all_devices = db.query(Device).all()

        # --- 3. TẠO SHIPMENT MẪU VÀ LIÊN KẾT VỚI DEVICE ---
        if db.query(Shipment).count() == 0 and all_devices:
            logger.info("Bắt đầu thêm dữ liệu mẫu cho lô hàng...")
            shipments_to_seed = []
            for i in range(10):
                shipments_to_seed.append(
                    Shipment(
                        name=f"Lô hàng {random.choice(['Vắc-xin', 'Trái cây', 'Hải sản'])} #{i+1}",
                        status=random.choice(["pending", "in_transit", "completed", "failed"]),
                        device_id=all_devices[i].id,
                        start_location=random.choice(["Kho Thủ Đức", "Cảng Cát Lái"]),
                        end_location=random.choice(["Kho Long Biên", "Sân bay Nội Bài"])
                    )
                )
            db.add_all(shipments_to_seed)
            db.commit()
            logger.info(f"Thêm {len(shipments_to_seed)} lô hàng mẫu thành công!")
        
        all_shipments = db.query(Shipment).all()

        # --- 4. TẠO ALERT MẪU VÀ LIÊN KẾT VỚI SHIPMENT ---
        if db.query(Alert).count() == 0 and all_shipments:
            logger.info("Bắt đầu thêm dữ liệu mẫu cho cảnh báo...")
            alerts_to_seed = []
            for i, shipment in enumerate(all_shipments):
                if i % 2 == 0: # Tạo cảnh báo cho một nửa số lô hàng
                    alerts_to_seed.append(
                        Alert(
                            shipment_id=shipment.id,
                            alert_type=random.choice(["Nhiệt độ cao", "Va đập mạnh", "Nhiệt độ thấp"]),
                            message=f"Ghi nhận sự kiện bất thường cho lô hàng {shipment.name}",
                            priority=random.choice(["Cao", "Trung bình", "Thấp"]),
                            status="active",
                            timestamp=datetime.now() - timedelta(hours=i)
                        )
                    )
            # Tạo một vài cảnh báo đã xử lý
            if len(all_shipments) > 1:
                 alerts_to_seed.append(Alert(shipment_id=all_shipments[1].id, alert_type="Dự báo nguy cơ", message="AI dự báo nguy cơ", priority="Thấp", status="resolved", resolution_note="Đã kiểm tra, không có vấn đề.", resolved_by_user_id=admin_user.id, resolved_at=datetime.now()))
            
            db.add_all(alerts_to_seed)
            db.commit()
            logger.info(f"Thêm {len(alerts_to_seed)} cảnh báo mẫu thành công!")

        # --- 5. TẠO REPORT MẪU ---
        if db.query(Report).count() == 0:
            logger.info("Bắt đầu thêm dữ liệu mẫu cho báo cáo...")
            reports_to_seed = [
                Report(name="Báo cáo tổng hợp Q2/2025", status="completed", file_path="/fake/path/report_q2.pdf", user_id=admin_user.id),
                Report(name="Báo cáo hành trình SH-001", status="completed", file_path="/fake/path/sh001.pdf", user_id=admin_user.id),
                Report(name="Báo cáo tháng 7 (đang xử lý)", status="processing", user_id=admin_user.id),
            ]
            db.add_all(reports_to_seed)
            db.commit()
            logger.info(f"Thêm {len(reports_to_seed)} báo cáo mẫu thành công!")

    except Exception as e:
        logger.error(f"Lỗi khi thêm dữ liệu mẫu: {e}")
        db.rollback()
    finally:
        db.close()
        logger.info("Đóng kết nối database.")

if __name__ == "__main__":
    logger.info("--- BẮT ĐẦU QUÁ TRÌNH SEED DATABASE ---")
    logger.info("Đang xóa và tạo lại tất cả các bảng...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    logger.info("Tạo bảng thành công.")
    seed_data()
    logger.info("--- QUÁ TRÌNH SEED DATABASE HOÀN TẤT ---") 