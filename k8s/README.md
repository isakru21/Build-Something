# Kubernetes Deployments

Kubernetes configuration files for the Media & Book Watchlist application.

## Files

- `all-deployments.yaml` - MongoDB, User Service, and Media Service deployments
- `ingress.yaml` - NGINX ingress routing configuration

## Quick Deploy

1. **Apply all deployments**
   ```bash
   kubectl apply -f all-deployments.yaml
   ```

2. **Apply ingress routing**
   ```bash
   kubectl apply -f ingress.yaml
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## Access Application

- **Frontend**: `http://localhost` (requires ingress controller)
- **User API**: `http://localhost/users`
- **Media API**: `http://localhost/media`

## Prerequisites

- Kubernetes cluster (local or remote)
- NGINX Ingress Controller installed
- Docker images built and available:
  - `isakrulander/user-service:1.0`
  - `isakrulander/media-service:1.0`

## Troubleshooting

```bash
# Check pod logs
kubectl logs deployment/user-service-deployment
kubectl logs deployment/media-service-deployment

# Check ingress
kubectl get ingress

# Delete everything
kubectl delete -f .
```

---

*Part of the [Media & Book Watchlist Application](../README.md)*