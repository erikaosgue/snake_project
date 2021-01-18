#!/bin/bash

# ./backend/database_files/stop_database.sh
# (cd backend; ./database_files/start_database.sh)
(cd backend; tmux new -s backend -d 'go run server.go') # 8081
(cd snake_frontend; tmux new -s frontend -d 'npm run serve -- --port 8082')