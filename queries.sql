CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  authors VARCHAR(500),
  cover_i VARCHAR(150),
  rating DOUBLE PRECISION,
  note TEXT,
  created_on DATE
);