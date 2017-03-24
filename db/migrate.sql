CREATE SCHEMA public;

CREATE TABLE clients
(
  id serial NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL,
  deleted_at timestamp,
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);

CREATE TABLE projects
(
  id serial NOT NULL,
  name text NOT NULL,
  client_id integer NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL,
  deleted_at timestamp,
  stage integer NOT NULL DEFAULT 1,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE TABLE users (
    id serial NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    session_token text NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE ONLY projects ADD CONSTRAINT clients_projects_fkey FOREIGN KEY (client_id) REFERENCES clients(id);
ALTER TABLE ONLY users ADD CONSTRAINT unique_user_email UNIQUE (email);
