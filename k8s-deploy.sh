#!/bin/bash
kubectl apply -f infrastructure/k8s/
echo "Application deployed to Kubernetes at http://localhost"