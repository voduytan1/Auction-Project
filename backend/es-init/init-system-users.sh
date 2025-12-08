#!/bin/bash
set -e  # Exit on error

echo ">> [INIT] Waiting for Elasticsearch to be ready..."

# Wait with timeout
MAX_RETRIES=30
RETRY_COUNT=0

until curl -s -u "elastic:${ELASTIC_PASSWORD}" http://elasticsearch:9200 >/dev/null; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "ERROR: Elasticsearch did not become ready in time"
    exit 1
  fi
  echo "Elasticsearch not ready yet... retrying in 5s ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 5
done

echo ">> [INIT] Elasticsearch is UP!"

# Set passwords with error checking
echo ">> [INIT] Setting password for kibana_system..."
if ! curl -X POST "http://elasticsearch:9200/_security/user/kibana_system/_password" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"${KIBANA_SYSTEM_PASSWORD}\"}"; then
  echo "ERROR: Failed to set kibana_system password"
  exit 1
fi

echo ">> [INIT] Setting password for logstash_system..."
if ! curl -X POST "http://elasticsearch:9200/_security/user/logstash_system/_password" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"${LOGSTASH_SYSTEM_PASSWORD}\"}"; then
  echo "ERROR: Failed to set logstash_system password"
  exit 1
fi

echo ">> [INIT] All system user passwords updated successfully!"