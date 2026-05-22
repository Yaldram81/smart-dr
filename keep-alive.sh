#!/bin/bash
# Keep-alive script for Next.js dev server
# Periodically pings the server to prevent it from being killed

while true; do
  curl -s -o /dev/null http://127.0.0.1:3000/ --max-time 10 2>/dev/null
  sleep 30
done
