DROP DATABASE IF EXISTS maskoff_app;
CREATE DATABASE maskoff_app;

\c maskoff_app;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    gender VARCHAR(7) NOT NULL,
    age INTEGER NOT NULL,
    CHECK (age>=18),
    CHECK (gender = 'Male' OR gender = 'Female')
);

CREATE TABLE IF NOT EXISTS listings(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    posted_by VARCHAR(30) NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    size VARCHAR(20) NOT NULL,
    whatsize VARCHAR(20) NOT NULL,
    condition VARCHAR(5) NOT NULL,
    image1 VARCHAR(255) NOT NULL,
    image2 VARCHAR(255) NOT NULL,
    image3 VARCHAR(255) NOT NULL,
    image4 VARCHAR(255) NOT NULL,
    image5 VARCHAR(255) NOT NULL,
    ship VARCHAR(4) NOT NULL,
    meetup VARCHAR(4) NOT NULL,
    cash INTEGER NOT NULL,
    CHECK (ship = 'Yes' OR ship = 'No'),
    CHECK (meetup = 'Yes' OR meetup = 'No'),
    CHECK (condition = 'New' OR condition = 'Used'),
    CHECK (brand = 'Adidas' OR brand = 'Nike' OR brand = 'Supreme' OR brand = 'Palace' OR brand = 'John Elliot'),
    CHECK (category = 'Sneakers' OR category = 'Clothing' OR category = 'Accessories'),
    FOREIGN KEY (posted_by) REFERENCES users(username)
);