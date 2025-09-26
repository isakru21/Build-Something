#!/bin/bash
cd infrastructure
docker compose up --build -d
echo "Application running at http://localhost:8080"