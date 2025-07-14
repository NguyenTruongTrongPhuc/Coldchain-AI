#!/bin/sh
# entrypoint.sh - Script to run the application in Docker

# Chạy Uvicorn server
# --host 0.0.0.0 để server có thể được truy cập từ bên ngoài container
# --port 8000 khớp với port đã EXPOSE trong Dockerfile
exec uvicorn app.main:app --host 0.0.0.0 --port 8000