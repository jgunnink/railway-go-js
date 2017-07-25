# Railway

A project which aims to support the life-cycle of client to vendor relationship
of the delivery of a product over the life of a project.

## Developer

[JK Gunnink](mailto:jgunnink@gmail.com)

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
1. In a browser, navigate to `http://localhost:8000`

## Dependencies

1. PostgreSQL
1. Golang (ensure you glide install to fetch dependencies)
1. Node

## Notes

The Go server runs on port 8000, and the react webserver runs on port 3000. The Go server reverse proxies the react server. Accessing the application on port 3000 in your browser will cause unhappiness :smiley:
If you'd like to see how this reverse proxy works, [see this commit](https://github.com/jgunnink/railway/commit/1f55004d1ebfa052e56d199bfb23aa460bcd2874)
