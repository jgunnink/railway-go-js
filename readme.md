# Railway

A project which aims to support the life-cycle of client to vendor relationship
of the delivery of a product over the life of a project.

## Developer

[JK Gunnink](mailto:jgunnink@gmail.com)

## What's included

- Users can signup for an account
- Roles are assigned to users (Admin, Manager, Staff, Client, Guest)
- Admin and manager roles can manage users via an admin interface panel
- Admin users can send password reset emails to users - a sendgrid API key is required (specify this in the go server package)
- Users can reset their passwords with a unique password reset link which is emailed to them
- Admin and managers can disable user accounts, preventing them from logging in.
- Cookies are destroyed on the front-end, not the back end:
  - When a user signs in, they are provided a cookie based on the session token in their account
  - When a user signs out the cookie is reset on the front end
- Notifications on user actions are included for most actions, such as creating an account, disabling a user, etc.

## Getting Started

### First clone and install the ninja-forms dependency, then link it:

```bash
git clone git@github.com:blockninja/ninja-forms.git $GOPATH/src/github.com/blockninja/ninja-forms
cd $_
npm install
npm run prepublish
npm link
```

### Next, clone the project repo

```bash
git clone git@github.com:jgunnink/railway.git $GOPATH/src/github.com/jgunnink/railway
cd $_
```

### Install required dependecies and create link to ninja-forms

```bash
npm install
npm link ninja-forms
ln -s ../src node_modules/railway
```

### Install go dependencies

```bash
glide install
```

### Start services

1. Ensure postgres is listening for connections. A docker example: `docker run --rm -p 5432:5432 --name db -e POSTGRES_USER=develop -e POSTGRES_PASSWORD=develop -e POSTGRES_DB=railway postgres`
1. `glide install`
1. Start the go server with `realize run`
1. Seed the database with `go run cmd/railway/*.go db:setup`
1. Start the react web server: `cd web/` then `npm start`
1. In a browser, navigate to `http://localhost:8080`

## Dependencies

1. PostgreSQL
1. Golang (ensure you glide install to fetch dependencies)
1. Node

## Notes

The Go server runs on port 8000, and the react webserver runs on port 3000. The Go server reverse proxies the react server. Accessing the application on port 3000 in your browser will cause unhappiness :smiley:
If you'd like to see how this reverse proxy works, [see this commit](https://github.com/jgunnink/railway/commit/1f55004d1ebfa052e56d199bfb23aa460bcd2874)
