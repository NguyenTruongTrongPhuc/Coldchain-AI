# ColdChain-AI Backend

Đây là phần backend cho dự án "Nền tảng Giám sát Chuỗi Cung Ứng Lạnh Thông Minh".
Được xây dựng bằng FastAPI (Python).

## Cài đặt và Chạy

1.  **Tạo môi trường ảo:**
    `python -m venv venv`
    `source venv/bin/activate` (Trên macOS/Linux) or `venv\Scripts\activate` (Trên Windows)

2.  **Cài đặt các gói phụ thuộc:**
    `pip install -r requirements.txt`

3.  **Cấu hình file `.env`:**
    Sao chép file `.env.example` (nếu có) thành `.env` và điền các thông tin cần thiết.

4.  **Chạy server phát triển:**
    `uvicorn app.main:app --reload`

5.  **Truy cập API Docs:**
    Mở trình duyệt và truy cập `http://127.0.0.1:8000/docs`.