# Dockerfile - For containerizing the FastAPI application

# Sử dụng một base image Python chính thức.
FROM python:3.9-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file requirements và cài đặt các gói phụ thuộc
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Sao chép toàn bộ mã nguồn của ứng dụng vào container
COPY ./app /app/app
COPY ./.env /app/.env
COPY ./entrypoint.sh /app/entrypoint.sh

# Cấp quyền thực thi cho entrypoint script
RUN chmod +x /app/entrypoint.sh

# Mở port 8000 để bên ngoài có thể truy cập vào ứng dụng
EXPOSE 8000

# Chạy entrypoint script khi container khởi động
CMD ["/app/entrypoint.sh"]