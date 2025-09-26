# Media Service

A Flask microservice for managing movies and books in the Media & Book Watchlist application.

## API Endpoints

**Base URL:** `http://localhost:5000` (or `/media` through ingress)

### Create Media Item
```http
POST /media
{
    "title": "Inception",
    "type": "Film",
    "status": "vill_se",
    "rating": 5,
    "review": "Amazing movie!",
    "author_id": "user_id_here"
}
```

### Get Media Items
```http
GET /media
GET /media?author_id={user_id}  # Filter by user
```

## Quick Start

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variable**
   ```bash
   export MONGO_URL="mongodb://root:example@localhost:27017/?authSource=admin"
   ```

3. **Run the service**
   ```bash
   python media_service.py
   ```

## Docker

```bash
docker build -t media-service .
docker run -p 5000:5000 -e MONGO_URL="mongodb://..." media-service
```

## Environment Variables

- `MONGO_URL`: MongoDB connection string (required)

## Tech Stack

- Python 3.9 + Flask 2.0.2
- MongoDB + PyMongo
- Docker containerized
- Integrates with User Service for author information

---

*Part of the [Media & Book Watchlist Application](../README.md)*