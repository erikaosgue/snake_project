
DROP DATABASE IF EXISTS snake_game;
DROP TABLE IF EXISTS users;
DROP USER IF EXISTS snake;

CREATE DATABASE  IF NOT EXISTS snake_game;
USE snake_game;


/* Create table for `puntajes` */
CREATE USER snake; 
GRANT ALL ON DATABASE snake_game TO snake;


CREATE TABLE IF NOT EXISTS users (
  id STRING NOT NULL PRIMARY KEY,
  name STRING NOT NULL,
  score INT
);