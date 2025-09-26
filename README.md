# Media & Book Watchlist Application

A modern, full-stack web application for managing personal movie and book lists. Users can create profiles, track movies and books they want to watch/read or have already seen/read, rate content, and write reviews.

## 🎯 Features

- **User Management**: Create and manage user profiles
- **Media Tracking**: Add movies and books to your personal lists
- **Status Tracking**: Mark items as "want to watch/read" or "watched/read"
- **Rating System**: Rate content from 1-5 stars
- **Reviews**: Write personal reviews for movies and books
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Multi-User Support**: Switch between different user profiles

## 🏗️ Architecture

This application follows a microservices architecture with the following components:

### Services
- **User Service** (`user-service/`): Handles user management and authentication
- **Media Service** (`media-service/`): Manages movies and books data
- **Frontend** (`index.html`): Single-page application with modern UI

### Infrastructure
- **Database**: MongoDB for persistent data storage
- **Containerization**: Docker containers for each service
- **Orchestration**: Kubernetes deployment with ingress configuration
- **Load Balancing**: NGINX ingress controller

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Kubernetes cluster (local or remote)
- kubectl configured
- NGINX Ingress Controller

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/isakru21/Build-Something.git
   cd Build-Something
   ```

2. **Build Docker images**
   ```bash
   # Build user service
   cd user-service
   docker build -t isakrulander/user-service:1.0 .
   
   # Build media service
   cd ../media-service
   docker build -t isakrulander/media-service:1.0 .
   ```

3. **Deploy to Kubernetes**
   ```bash
   # Apply all deployments
   kubectl apply -f k8s/all-deployments.yaml
   
   # Apply ingress configuration
   kubectl apply -f k8s/ingress.yaml
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost`
   - The application will be available once all pods are running

### Verify Deployment
```bash
# Check pod status
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress
```

## 📁 Project Structure

```
Build-Something/
├── user-service/           # User management microservice
│   ├── Dockerfile         # Container configuration
│   ├── user_service.py    # Flask application
│   └── requirements.txt   # Python dependencies
├── media-service/         # Media management microservice
│   ├── Dockerfile         # Container configuration
│   ├── media_service.py   # Flask application
│   └── requirements.txt   # Python dependencies
├── k8s/                   # Kubernetes configurations
│   ├── all-deployments.yaml  # Main deployments and services
│   └── ingress.yaml       # Ingress routing configuration
├── index.html             # Frontend application
├── deploy.bat            # Windows deployment script
└── README.md             # This file
```

## 🔧 API Documentation

### User Service (Port 5001)

#### Create User
```http
POST /users
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com"
}
```

#### Get All Users
```http
GET /users
```

#### Get User by ID
```http
GET /users/{user_id}
```

#### Get User by Username
```http
GET /users/username/{username}
```

### Media Service (Port 5000)

#### Add Media Item
```http
POST /media
Content-Type: application/json

{
    "title": "Inception",
    "type": "Film",
    "status": "vill_se",
    "rating": 5,
    "review": "Amazing movie!",
    "author_id": "user_id_here"
}
```

#### Get Media Items
```http
GET /media
GET /media?author_id={user_id}  # Filter by user
```

## 🛠️ Technology Stack

### Backend
- **Python 3.9**: Core runtime
- **Flask 2.0.2**: Web framework
- **PyMongo**: MongoDB driver
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **HTML5/CSS3/JavaScript**: Core web technologies
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

### Database
- **MongoDB**: NoSQL document database
- **Collections**: Users, Media items

### DevOps
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **NGINX**: Reverse proxy and load balancer

## 🔒 Environment Variables

### Required Environment Variables
- `MONGO_URL`: MongoDB connection string
  - Format: `mongodb://username:password@host:port/?authSource=admin`
  - Example: `mongodb://root:example@mongodb-service:27017/?authSource=admin`

## 🌐 Deployment Options

### Kubernetes (Recommended)
The application is designed for Kubernetes deployment with:
- Persistent storage for MongoDB
- Service discovery between microservices
- Ingress routing for external access
- Health checks and auto-restart capabilities

### Local Development
For local development, you can run services individually:
```bash
# Start MongoDB locally
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo:latest

# Set environment variable
export MONGO_URL="mongodb://root:example@localhost:27017/?authSource=admin"

# Run user service
cd user-service && python user_service.py

# Run media service
cd media-service && python media_service.py
```

## 🔍 Monitoring and Troubleshooting

### Check Service Health
```bash
# Check if services are responding
curl http://localhost/users
curl http://localhost/media
```

### Common Issues
1. **Services not starting**: Check MongoDB connection
2. **CORS errors**: Verify ingress CORS configuration
3. **Data not persisting**: Check MongoDB persistent volume

### Logs
```bash
# View service logs
kubectl logs -f deployment/user-service-deployment
kubectl logs -f deployment/media-service-deployment
kubectl logs -f deployment/mongodb-deployment
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Search and filtering capabilities
- [ ] Import/export functionality
- [ ] Social features (sharing lists, recommendations)
- [ ] Integration with external APIs (IMDB, Goodreads)
- [ ] Progressive Web App (PWA) support
- [ ] Advanced analytics and statistics

## 👨‍💻 Author

**Isak Rulander** - [@isakru21](https://github.com/isakru21)

---

*Built with ❤️ using modern web technologies and cloud-native practices*