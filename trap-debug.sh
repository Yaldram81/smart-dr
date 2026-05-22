#!/bin/bash
cd /home/z/my-project

# Set up traps for ALL signals
trap 'echo "SIGHUP at $(date)" >> /home/z/my-project/signal.log' HUP
trap 'echo "SIGINT at $(date)" >> /home/z/my-project/signal.log' INT
trap 'echo "SIGTERM at $(date)" >> /home/z/my-project/signal.log' TERM
trap 'echo "SIGUSR1 at $(date)" >> /home/z/my-project/signal.log' USR1
trap 'echo "SIGUSR2 at $(date)" >> /home/z/my-project/signal.log' USR2

echo "Trap debug started at $(date), PID=$$" > /home/z/my-project/signal.log

# Start the server
NODE_OPTIONS="--max-old-space-size=768" npx next dev -p 3000 &
NEXT_PID=$!
echo "Next.js PID: $NEXT_PID" >> /home/z/my-project/signal.log

# Wait for server and keep this script alive
wait $NEXT_PID
EXIT_CODE=$?
echo "Next.js exited with code: $EXIT_CODE (signal: $((EXIT_CODE - 128)))" >> /home/z/my-project/signal.log
