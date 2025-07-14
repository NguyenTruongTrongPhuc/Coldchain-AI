# app/services/notification_service.py
# TODO: Chứa logic gửi thông báo đa kênh (email, SMS, Telegram)

class NotificationService:
    def send_email(self, to: str, subject: str, body: str):
        # Logic gửi email (sử dụng smtplib, SendGrid, etc.)
        print(f"Sending email to {to}: {subject}")
        pass

    def send_telegram_message(self, chat_id: str, message: str):
        # Logic gửi tin nhắn Telegram
        print(f"Sending Telegram message to {chat_id}")
        pass