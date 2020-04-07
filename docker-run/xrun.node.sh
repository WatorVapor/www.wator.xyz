#!/bin/bash
docker run -it \
  -v /watorvapor/workspace/www.wator.xyz/www2:/opt/www \
  -v /etc/passwd:/etc/passwd:ro \
  -v /etc/group:/etc/group:ro \
  -u $(id -u $USER):$(id -g $USER) \
  --workdir="/opt/www" \
  node:lts /bin/bash
