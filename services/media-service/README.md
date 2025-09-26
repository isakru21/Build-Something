# Media Service

Flask microservice for movie and book management.

## API

```http
POST /media               # Add media item
GET /media                # Get all media
GET /media?author_id={id} # Filter by user
```

## Run

```bash
pip install -r requirements.txt
export MONGO_URL="mongodb://root:example@localhost:27017/?authSource=admin"  
python media_service.py
```

## Docker

```bash
docker build -t media-service .
docker run -p 5000:5000 -e MONGO_URL="..." media-service
```