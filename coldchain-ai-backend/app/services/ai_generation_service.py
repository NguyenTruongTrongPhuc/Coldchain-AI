# app/services/ai_generation_service.py
# TODO: Chứa logic gọi tới các API sinh nội dung như Google Gemini

class AIGenerationService:
    def generate_root_cause_analysis(self, context_data: dict) -> str:
        """
        Sử dụng LLM (Gemini) để phân tích nguyên nhân gốc rễ của sự cố.
        """
        # Logic gọi Google Gemini Pro API
        print("Calling Gemini API for root cause analysis...")
        return "Root cause analysis: The container door was likely left open during the stop at location X, causing a rapid increase in temperature."