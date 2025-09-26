#!/bin/bash
cd infrastructure  
docker compose down
docker system prune -f