#!/bin/bash
cd /home/z/my-project
echo "=== Starting Next.js server at $(date) ===" >> /home/z/my-project/server-debug.log
NODE_OPTIONS="--max-old-space-size=768" npx next dev -p 3000 2>&1 | tee -a /home/z/my-project/dev.log
EXIT_CODE=$?
echo "=== Server exited at $(date) with code: $EXIT_CODE ===" >> /home/z/my-project/server-debug.log
echo "=== Signal that killed it: $((EXIT_CODE - 128)) ===" >> /home/z/my-project/server-debug.log

# If killed by signal, identify which one
case $((EXIT_CODE - 128)) in
  1) echo "SIGHUP - terminal hangup" >> /home/z/my-project/server-debug.log ;;
  2) echo "SIGINT - interrupt" >> /home/z/my-project/server-debug.log ;;
  9) echo "SIGKILL - forcibly killed (OOM?)" >> /home/z/my-project/server-debug.log ;;
  15) echo "SIGTERM - termination" >> /home/z/my-project/server-debug.log ;;
  *) echo "Unknown signal or normal exit" >> /home/z/my-project/server-debug.log ;;
esac
