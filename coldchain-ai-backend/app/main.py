from fastapi import FastAPI
from .core.database import engine, Base
from .api.v1.routers import api_router
from fastapi.middleware.cors import CORSMiddleware

# Tạo các bảng trong database (nếu chúng chưa tồn tại)
# Trong môi trường production, bạn nên dùng Alembic để quản lý migration.
Base.metadata.create_all(bind=engine)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="ColdChain-AI API",
    description="API for the Smart Cold Chain Monitoring Platform.",
    version="1.0.0"
)

# Cấu hình CORS (Cross-Origin Resource Sharing)
# Cho phép Frontend (chạy ở domain khác) có thể gọi API này.
origins = [
    "http://localhost:3000",  # Địa chỉ của React/Next.js dev server
    # Thêm các domain khác của frontend ở đây nếu cần
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bao gồm tất cả các routes từ api_router với prefix /api/v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def read_root():
    """Endpoint gốc để kiểm tra hệ thống có hoạt động không."""
    return {"message": "Welcome to ColdChain-AI API!"}