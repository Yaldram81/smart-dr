#!/bin/bash
# Kill any existing server
pkill -f "next dev" 2>/dev/null
pkill -f "app.py" 2>/dev/null
sleep 2
rm -rf /home/z/my-project/.next

# Start the ML service (SVC model on port 3031)
cd /home/z/my-project/mini-services/ml-service
nohup ./venv/bin/python -c "from app import app; app.run(host='0.0.0.0', port=3031, debug=False, use_reloader=False, threaded=True)" > service.log 2>&1 &
echo "ML service PID: $!" > /tmp/ml-service.pid

# Start the Next.js server
cd /home/z/my-project
NODE_OPTIONS="--max-old-space-size=768" npx next dev -p 3000 > /home/z/my-project/dev.log 2>&1 &
echo $! > /tmp/next-server.pid

# Wait for Next.js to be ready
for i in $(seq 1 30); do
  if ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "Server started and ready at $(date)" >> /tmp/next-server-status.log
    exit 0
  fi
  sleep 1
done
echo "Server failed to start at $(date)" >> /tmp/next-server-status.log
exit 1
