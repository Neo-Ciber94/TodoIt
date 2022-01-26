#!/bin/bash

docker-compose --project-name mongodb-cluster up -d 

sleep 5

docker exec -it mongodb-1 /mongo-cluster/scripts/init-replicas.sh