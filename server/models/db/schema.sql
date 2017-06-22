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
    userid BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS listings(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    accepted BOOLEAN DEFAULT FALSE,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_accepted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    who_accepted VARCHAR(30) NOT NULL DEFAULT 'empty',
    userid INTEGER NOT NULL,
    category VARCHAR(20) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    size VARCHAR(20) NOT NULL,
    whatsize VARCHAR(20) NOT NULL,
    condition VARCHAR(5) NOT NULL,
    ship VARCHAR(4) NOT NULL,
    meetup VARCHAR(4) NOT NULL,
    cash INTEGER NOT NULL,
    CHECK (ship = 'Yes' OR ship = 'No'),
    CHECK (meetup = 'Yes' OR meetup = 'No'),
    CHECK (condition = 'New' OR condition = 'Used'),
    CHECK (category = 'Footwear' OR category = 'Clothing' OR category = 'Accessories'),
    CHECK (cash >= 0),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS images(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    image1 VARCHAR(255) NOT NULL,
    image2 VARCHAR(255) NOT NULL,
    image3 VARCHAR(255) NOT NULL,
    image4 VARCHAR(255) NOT NULL,
    image5 VARCHAR(255) NOT NULL,
    FOREIGN KEY (id) REFERENCES listings(id)
);