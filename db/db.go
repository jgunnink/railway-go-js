package db

import (
	"log"
	"time"

	"github.com/jackc/pgx"
	"github.com/jgunnink/railway"
	"github.com/pkg/errors"
)

// MethodInfo is used for logging metadata of DB methods
type MethodInfo struct {
	Name        string
	Description string
}

// DB contains the database connection
type DB struct {
	client        *pgx.ConnPool
	authService   *AuthService
	clientService *ClientService
	userService   *UserService
}

// New returns a new instance of DB
func New(dbname, username, password, host string, port uint) *DB {
	connConfig := &pgx.ConnConfig{
		Database:  dbname,
		Host:      host,
		Port:      uint16(port),
		User:      username,
		Password:  password,
		TLSConfig: nil,
	}

	connPool, err := pgx.NewConnPool(pgx.ConnPoolConfig{
		ConnConfig:     *connConfig,
		AfterConnect:   nil,
		MaxConnections: 20,
		AcquireTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatalln(err)
	}

	as := &AuthService{
		db: connPool,
	}

	cs := &ClientService{
		db: connPool,
	}

	us := &UserService{
		db: connPool,
	}

	return &DB{
		client:        connPool,
		authService:   as,
		clientService: cs,
		userService:   us,
	}
}

// Close will close the connection to the DB
func (db *DB) Close() {
	db.client.Close()
}

// AuthService returns the dial service associated with the client.
func (db *DB) AuthService() railway.AuthService {
	return db.authService
}

// ClientService returns the dial service associated with the client.
func (db *DB) ClientService() railway.ClientService {
	return db.clientService
}

// UserService returns the dial service associated with the client.
func (db *DB) UserService() railway.UserService {
	return db.userService
}

// Migrate will begin the database migration
func (db *DB) Migrate() {
	log.Println("Begin DB migration")
	_, err := db.client.Exec(migrateSQL)
	if err != nil {
		panic(errors.Wrap(err, "Could not migrate"))
	}
}

// Drop will drop the entire DB
func (db *DB) Drop() {
	_, err := db.client.Exec("DROP SCHEMA public CASCADE;")
	if err != nil {
		log.Println(err)
	}
}
