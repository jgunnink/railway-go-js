CREATE SCHEMA public;

CREATE TABLE users (
    id serial NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
	role text NOT NULL,
    session_token text NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);
