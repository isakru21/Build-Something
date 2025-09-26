FROM python:3.9-slim-bullseye
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get upgrade -y && pip install --upgrade pip && pip install -r requirements.txt
COPY . .
CMD ["python", "user_service.py"]