DROP DATABASE IF EXISTS maskoff_app;
CREATE DATABASE maskoff_app;

\c maskoff_app;


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL,
    CHECK (age>=18)
);

CREATE TABLE IF NOT EXISTS listings(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    date_created TEXT DEFAULT now(),
    posted_by VARCHAR(30) NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
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
    CHECK (category = 'Sneakers' OR category = 'Clothing' OR category = 'Accessories')
);

CREATE TABLE IF NOT EXISTS acceptedListings(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    date_accepted TEXT DEFAULT now(),
    who_accepted VARCHAR(30) NOT NULL,
    trading_with VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    condition VARCHAR(5) NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    image1 VARCHAR(255) NOT NULL,
    cash INTEGER NOT NULL,
    ship VARCHAR(4) NOT NULL,
    meetup VARCHAR(4) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (ship = 'Yes' OR ship = 'No'),
    CHECK (meetup = 'Yes' OR meetup = 'No')
);