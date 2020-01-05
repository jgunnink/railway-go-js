# Railway

A project which aims to support the life-cycle of client to vendor relationship
of the delivery of a product over the life of a project.

## Developer

[JK Gunnink](mailto:jgunnink@gmail.com)

## What's included

- Users can signup for an account
- Roles are assigned to users (Admin, Manager, Staff, Client, Guest)
- Admin and manager roles can manage users via an admin interface panel
- Admin users can send password reset emails to users - a sendgrid API key is required (specify this
  in the go server package)
- Users can reset their passwords with a unique password reset link which is emailed to them
- Admin and managers can disable user accounts, preventing them from logging in.
- Cookies are destroyed on the front-end, not the back end:
  - When a user signs in, they are provided a cookie based on the session token in their account
  - When a user signs out the cookie is reset on the front end
- Notifications on user actions are included for most actions, such as creating an account,
  disabling a user, etc.

## Getting Started

1. Clone repo
1. Install dependencies with glide (`go get github.com/Masterminds/glide`) via the `glide install`
   command.

## Start services:

1. Ensure postgres is listening for connections. A docker example:
   ```
   docker run --rm -p 5432:5432 --name db -e POSTGRES_USER=develop -e POSTGRES_PASSWORD=develop -e POSTGRES_DB=railway postgres:alpine
   ```
1. `glide install`
1. Start the go server with `go run cmd/railway/main.go`
1. Seed the database with `go run cmd/railway/*.go db:setup`

## Dependencies

1. PostgreSQL
1. Golang >1.7

## Notes

This repo is intended to be bundled with a react js front-end. Due to some dependencies no longer
being available, the front-end has been removed temporarily and this repo is currently just a
back-end system.

The Go server runs on port 8000, and the react webserver runs on port 3000. The Go server reverse
proxies the react server. Accessing the application on port 3000 in your browser will cause
unhappiness :smiley: If you'd like to see how this reverse proxy works, [see this
commit](https://github.com/jgunnink/railway/commit/1f55004d1ebfa052e56d199bfb23aa460bcd2874)
