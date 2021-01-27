#!/bin/bash

# ./backend/database_files/stop_database.sh

# create a new Database and table
./backend/database_files/create_database.sh

# To Start  one of nodecockroach database
./backend/database_files/start_database.sh

# start the backend server
(cd backend; tmux new -s backend -d 'go run server.go') # 8081

# start the frontend server
(cd snake_frontend; tmux new -s frontend -d 'npm run serve -- --port 8082')
