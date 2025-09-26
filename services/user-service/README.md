# User Service

Flask microservice for user management.

## API

```http
POST /users               # Create user
GET /users                # Get all users  
GET /users/{id}          # Get user by ID
GET /users/username/{name} # Get by username
```

## Run

```bash
pip install -r requirements.txt
export MONGO_URL="mongodb://root:example@localhost:27017/?authSource=admin"
python user_service.py
```

## Docker

```bash
docker build -t user-service .
docker run -p 5001:5001 -e MONGO_URL="..." user-service
```