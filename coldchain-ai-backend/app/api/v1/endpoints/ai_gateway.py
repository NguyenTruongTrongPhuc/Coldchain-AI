# app/api/v1/endpoints/ai_gateway.py
# TODO: Hoàn thiện các endpoint làm gateway cho các dịch vụ AI
from fastapi import APIRouter

router = APIRouter()

@router.post("/predict/temperature")
def predict_temperature():
    """
    Endpoint nhận dữ liệu và gọi tới service dự đoán nhiệt độ.
    """
    pass

@router.post("/generate/report")
def generate_report():
    """
    Endpoint kích hoạt việc tạo báo cáo hành trình bằng AI.
    """
    pass