#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-8123}"
HOST="${HOST:-127.0.0.1}"
URL="http://127.0.0.1:${PORT}"

echo "Starting Acquisition Strategy Agent on ${URL}"
echo "Set HOST=0.0.0.0 before running this script if you want LAN sharing."
python3 server.py --host "$HOST" --port "$PORT" &
PID=$!
sleep 1
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
fi
trap 'kill "$PID" 2>/dev/null || true' EXIT
wait "$PID"
