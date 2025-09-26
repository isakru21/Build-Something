@echo off
echo === Starting Automated Deployment for Media App ===

echo.
echo --- Building and pushing user-service (unchanged) ---
cd user-service
docker build --no-cache -t isakrulander/user-service:1.0 .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for user-service failed. Exiting.
    exit /b %errorlevel%
)
docker push isakrulander/user-service:1.0
if %errorlevel% neq 0 (
    echo ERROR: Docker push for user-service failed. Exiting.
    exit /b %errorlevel%
)
cd ..

echo.
echo --- Building and pushing media-service ---
cd media-service
docker build --no-cache -t isakrulander/media-service:1.0 .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for media-service failed. Exiting.
    exit /b %errorlevel%
)
docker push isakrulander/media-service:1.0
if %errorlevel% neq 0 (
    echo ERROR: Docker push for media-service failed. Exiting.
    exit /b %errorlevel%
)
cd ..

echo.
echo --- Applying Kubernetes deployments ---
cd k8s

echo Deleting existing resources to ensure a clean slate...
kubectl delete ingress media-app-ingress recipe-app-ingress --ignore-not-found=true
kubectl delete deployment user-service-deployment media-service-deployment recipe-service-deployment mongodb-deployment --ignore-not-found=true
kubectl delete service user-service media-service recipe-service mongodb-service --ignore-not-found=true
kubectl delete pvc mongodb-pvc --ignore-not-found=true

echo Applying new Kubernetes configurations...
kubectl apply -f all-deployments.yaml
kubectl apply -f ingress.yaml

echo.
echo --- Forcing deployment restart to pull new images ---
kubectl rollout restart deployment/user-service-deployment
kubectl rollout restart deployment/media-service-deployment

echo Waiting for services to initialize...
timeout /t 15 /nobreak
echo.

echo Deployment complete! Getting pod status...
kubectl get pods
cd ..

echo.
echo === Deployment Finished Successfully ===
pause

