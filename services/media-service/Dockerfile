FROM python:3.9-slim-bullseye
WORKDIR /app
RUN apt-get update && apt-get upgrade -y && apt-get clean
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "media_service.py"]
