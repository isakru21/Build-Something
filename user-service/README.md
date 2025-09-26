# User Service

A Flask microservice for managing user accounts in the Media & Book Watchlist application.

## API Endpoints

**Base URL:** `http://localhost:5001` (or `/users` through ingress)

### Create User
```http
POST /users
{
    "username": "john_doe",
    "email": "john@example.com"
}
```

### Get All Users
```http
GET /users
```

### Get User by ID
```http
GET /users/{user_id}
```

### Get User by Username
```http
GET /users/username/{username}
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
   python user_service.py
   ```

## Docker

```bash
docker build -t user-service .
docker run -p 5001:5001 -e MONGO_URL="mongodb://..." user-service
```

## Environment Variables

- `MONGO_URL`: MongoDB connection string (required)

## Tech Stack

- Python 3.9 + Flask 2.0.2
- MongoDB + PyMongo
- Docker containerized

---

*Part of the [Media & Book Watchlist Application](../README.md)*