#!/bin/bash
docker run -it \
  -v /watorvapor/workspace/www.wator.xyz/adonis:/opt/www \
  -v /etc/passwd:/etc/passwd:ro \
  -v /etc/group:/etc/group:ro \
  -v /watorvapor/workspace/www.wator.xyz/adonis/home:/home/$USER \
  -u $(id -u $USER):$(id -g $USER) \
  --workdir="/opt/www" \
  node:lts /bin/bash
