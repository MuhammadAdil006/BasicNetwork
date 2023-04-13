docker-compose up -d
to run the docker file
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)