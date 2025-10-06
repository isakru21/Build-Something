# Media & Book Watchlist

A microservices application for managing personal movie and book lists built with Python Flask, MongoDB, and Kubernetes.

## Link to git repo:
https://github.com/isakru21/Build-Something.git

## Application Screenshots

### User Interface
![Application Screenshot](Photos/showcase.png)

### System Architecture
![System Diagram](Photos/system-diagram.png)

## Quick Start

### Docker Compose (Development)
```bash
# Start application
./deploy.sh

# Stop application  
./down.sh
```
Access: `http://localhost:8080`

### Kubernetes (Production)
```bash
# Deploy to Kubernetes
./k8s-deploy.sh
```
Access: `http://localhost`

## Architecture

This application demonstrates microservices architecture with:

- **User Service** - Handles user registration and authentication
- **Media Service** - Manages movie/book watchlists and ratings
- **MongoDB** - NoSQL database for persistent storage
- **Frontend** - Responsive web interface
- **NGINX Ingress** - Load balancing and routing

## Project Structure

```
├── services/
│   ├── user-service/     # User management API (Flask)
│   └── media-service/    # Media tracking API (Flask)
├── frontend/             # Web application (HTML/CSS/JS)
├── infrastructure/
│   ├── docker-compose.yml    # Docker development setup
│   └── k8s/                  # Kubernetes production setup
└── Photos/               # Screenshots and diagrams
```

## API Endpoints

### Development (Docker Compose)
- **Users**: `http://localhost:5001/users`
- **Media**: `http://localhost:5000/media`

### Production (Kubernetes)
- **Users**: `http://localhost/users`
- **Media**: `http://localhost/media`

## Features

- Create and manage user accounts
- Add movies and books to personal watchlists
- Rate and review media items
- Microservices communicate via REST APIs
- Persistent data storage with MongoDB
- Scalable Kubernetes deployment

## What This App Does

It's a basic movie and book watchlist. You can create an account, add movies or books you want to watch/read, and rate them. Pretty simple stuff, but it shows how microservices work.

## How It's Built

I split it into two services - one handles users and one handles the media items. Both use Python Flask. There's a MongoDB database and a  web page to interact with everything. It all runs on Kubernetes.

When you add a movie, the media service talks to the user service to get your username. This shows how the services communicate with each other.

## Why Microservices

Honestly, this app is probably too small to really need microservices. You could build this as one simple app. But for learning purposes, it demonstrates the concepts. In a real company, you might have different teams working on user management versus content management, so splitting them makes sense.

The main benefit is you can scale and update each service separately. If everyone's adding movies at the same time, you can run more media service instances without touching the user service.

## The Problems

Microservices add complexity. Instead of one app, now you have multiple services that need to talk to each other. Network calls can fail, and debugging becomes harder when things go wrong. You also need to think about what happens if one service is down but others are still running.

## Security Issues

The current setup has some major security problems that you wouldn't want in production:

- No real user authentication - anyone can create/access user accounts
- Database credentials are hardcoded in the deployment files
- No HTTPS encryption, everything is plain HTTP
- No input validation, so users could potentially inject malicious data
- Services trust each other completely with no verification

In a real production system, you'd need proper user login with secure passwords, encrypted communication, input sanitization, and probably some kind of API keys or tokens for service-to-service communication.

## Running It

Use `./k8s-deploy.sh` to deploy everything to Kubernetes. Then go to http://localhost to use the app. The services are available at /users and /media endpoints.

The Kubernetes setup is in the infrastructure/k8s folder if you want to see how it's configured.

