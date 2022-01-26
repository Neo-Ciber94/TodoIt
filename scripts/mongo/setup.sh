#!/bin/bash

docker-compose --project-name todoit-mongodb up -d 

sleep 5

docker exec -it todoit-mongo1 /scripts/mongo/mongo-replicas.sh