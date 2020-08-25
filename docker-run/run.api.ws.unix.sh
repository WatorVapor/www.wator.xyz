#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0); pwd)
PARENT_DiR=$(dirname $SCRIPT_DIR)
echo "SCRIPT_DIR:=${SCRIPT_DIR}"
echo "PARENT_DiR:=${PARENT_DiR}"
DOCKER_MAME=www.wator.xyz.ws.api.unix
docker stop ${DOCKER_MAME}
docker rm ${DOCKER_MAME}
docker run -d \
  -v /etc/group:/etc/group:ro \
  -v /etc/passwd:/etc/passwd:ro \
  -v /dev/shm/:/dev/shm/ \
  -v /tmp/wator/wss:/tmp/wator/wss\
  -v ${PARENT_DiR}:${PARENT_DiR} \
  -u $(id -u $USER):$(id -g $USER) \
  -w ${PARENT_DiR} \
  --net host \
  --memory=32M \
  --cpu-shares=128 \
  --name "${DOCKER_MAME}" \
  --restart=always \
  node:lts node ./wss/index.js