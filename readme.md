# Railway
A ReactJS template with a backend built on Go used to build web applications.

## Developer
[JK Gunnink](mailto:jgunnink@gmail.com)

## Getting Started
After cloning the repo:
1. Ensure postgres is listening for connections.
2. `go run *.go db:drop` then `go run *.go db:migrate`
3. Start the go server with `realize run`
4. Start the react web server: `cd web/` then `npm start`
5. In a browser, navigate to `http://localhost:8000`

## Dependencies
1. PostgreSQL
2. Golang (ensure you glide install to fetch dependencies)
3. Node

## Notes
The Go server runs on port 8000, and the react webserver runs on port 3000. The Go server reverse proxies the react server. Accessing the application on port 3000 in your browser will cause unhappiness :smiley:
If you'd like to see how this reverse proxy works, [see this commit](https://github.com/jgunnink/railway/commit/1f55004d1ebfa052e56d199bfb23aa460bcd2874)
