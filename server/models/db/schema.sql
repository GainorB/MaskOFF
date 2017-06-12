DROP DATABASE IF EXISTS maskoff_app;
CREATE DATABASE maskoff_app;

\c maskoff_app;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    state VARCHAR(200) NOT NULL,
    city VARCHAR(200) NOT NULL,
    gender VARCHAR(7) NOT NULL,
    age INTEGER NOT NULL,
    CHECK (age>=18),
    CHECK (gender = 'Male' OR gender = 'Female')
);