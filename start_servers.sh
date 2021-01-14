#!/bin/bash

# (cd backend; ./database_files/start_database.sh)
(cd backend; tmux new -s backend -d 'go run server.go')
(cd game_engine; tmux new -s game_engine -d 'python3 -m http.server 8000')
(cd snake_frontend; tmux new -s frontend -d 'npm run serve -- --port 8082')