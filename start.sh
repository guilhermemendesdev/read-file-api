#!/bin/sh

# Setup /etc/hosts file
HOSTNAME=$(hostname)
cp /etc/hosts /home/node/api/hosts.new
sed -i "s/127.0.0.1.*/127.0.0.1   localhost localhost.localdomain $HOSTNAME/g" /home/node/api/hosts.new
cat /home/node/api/hosts.new > /etc/hosts

# Start application
yarn start