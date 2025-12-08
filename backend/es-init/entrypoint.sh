#!/bin/bash
set -e

echo ">> Starting Elasticsearch..."
# Start Elasticsearch in background
/usr/local/bin/docker-entrypoint.sh eswrapper &
ES_PID=$!

echo ">> Waiting for Elasticsearch to be fully ready..."
# Đợi lâu hơn để ES thực sự ready
sleep 40

echo ">> Running init script to set passwords..."
/usr/local/bin/init-system-users.sh

echo ">> Init complete! Elasticsearch is ready."

# Keep ES running
wait $ES_PID