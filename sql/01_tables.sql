CREATE TABLE book (
  id SERIAL PRIMARY KEY NOT NULL,
  isbn_10 CHAR(10),
  isbn_13 CHAR(13) NOT NULL,
  title VARCHAR(255) NOT NULL,
  publication_date DATE
);

CREATE TABLE author (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE category (
  id SMALLSERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE publisher (
  id SMALLSERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE book_category (
  book_id INT REFERENCES book (id) ON UPDATE CASCADE ON DELETE CASCADE,
  category_id SMALLINT REFERENCES category (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT book_category_pkey PRIMARY KEY (book_id, category_id)
);

CREATE TABLE book_author (
  book_id INT REFERENCES book (id) ON UPDATE CASCADE ON DELETE CASCADE,
  author_id SMALLINT REFERENCES author (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT book_author_pkey PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_publisher (
  book_id INT REFERENCES book (id) ON UPDATE CASCADE ON DELETE CASCADE,
  publisher_id SMALLINT REFERENCES publisher (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT book_publisher_pkey PRIMARY KEY (book_id, publisher_id)
);