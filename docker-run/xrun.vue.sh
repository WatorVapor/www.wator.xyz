#!/bin/bash
docker run -it \
  -v /watorvapor/workspace/www.wator.xyz/vue:/opt/vue \
  -v /etc/passwd:/etc/passwd:ro \
  -v /etc/group:/etc/group:ro \
  -v /watorvapor/workspace/www.wator.xyz/vue/home:/home/$USER \
  -u $(id -u $USER):$(id -g $USER) \
  --workdir="/opt/vue" \
  node:lts /bin/bash
