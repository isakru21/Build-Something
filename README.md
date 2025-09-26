# Media & Book Watchlist

A microservices application for managing personal movie and book lists.

## Quick Start

```bash
# Start application
./deploy.sh

# Stop application  
./down.sh

# Deploy to Kubernetes
./k8s-deploy.sh
```

Access: `http://localhost:8080`

## Structure

```
├── services/              # Microservices
│   ├── user-service/     # User management  
│   └── media-service/    # Media tracking
├── frontend/             # Web application
└── infrastructure/       # Deploy configs
```

## API

- **Users**: `http://localhost:5001/users`
- **Media**: `http://localhost:5000/media`