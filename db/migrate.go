package db

var migrateSQL = `
CREATE SCHEMA public;

CREATE TABLE clients (
	id serial NOT NULL,
	name text NOT NULL,
	description text NOT NULL,
	data jsonb NOT NULL,
	archived boolean NOT NULL,
	archived_on timestamp,
	created_at timestamp NOT NULL,
	CONSTRAINT clients_pkey PRIMARY KEY (id),
	CONSTRAINT clients_name_key UNIQUE (name)
);

ALTER TABLE clients ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE clients ALTER COLUMN archived SET DEFAULT false;

CREATE TABLE users (
	id serial NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	email text NOT NULL,
	password text NOT NULL,
	role text NOT NULL,
	session_token text NOT NULL,
	data jsonb NOT NULL,
	client_id int,
	disabled boolean NOT NULL,
	disabled_on timestamp,
	archived boolean NOT NULL,
	archived_on timestamp,
	created_at timestamp NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_email_key UNIQUE (email)
);

ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE users ALTER COLUMN archived SET DEFAULT false;
`
