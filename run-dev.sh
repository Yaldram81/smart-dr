#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS="--max-old-space-size=768" npx next dev -p 3000 2>&1 | tee /home/z/my-project/dev.log
  echo "Server crashed at $(date), restarting in 3s..." >> /home/z/my-project/dev.log
  sleep 3
done
