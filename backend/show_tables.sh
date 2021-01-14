#!/bin/bash

cockroach sql --insecure --execute="SELECT * from users;"  --user=snake --host=127.0.0.1 --database=snake_game

