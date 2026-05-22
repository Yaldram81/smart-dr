#!/bin/bash
# Check if Next.js server is running, restart if not
if ! ss -tlnp 2>/dev/null | grep -q ":3000 "; then
  echo "Server not running, restarting..." >> /tmp/next-server-status.log
  bash /home/z/my-project/restart-server.sh
else
  echo "Server already running at $(date)" >> /tmp/next-server-status.log
fi
