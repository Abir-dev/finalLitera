#!/bin/bash

echo "Starting LMS-kinG Development Environment..."
echo

echo "Starting Backend Server on port 5001..."
cd server && npm run dev &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting Frontend Server on port 5173..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
