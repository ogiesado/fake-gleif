#!/bin/bash

echo "The future will come by itself; progress will not";

. ~/.nvm/nvm.sh

npm install --no-optional

docker-compose stop
docker-compose build
docker-compose up -d
