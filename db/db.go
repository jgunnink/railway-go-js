package db

import (
	"fmt"
	"log"

	"github.com/jgunnink/railway"
	"github.com/jmoiron/sqlx"

	// Postgres driver
	_ "github.com/lib/pq"
)

// DB contains the database connection
type DB struct {
	client        *sqlx.DB
	authService   *AuthService
	clientService *ClientService
	userService   *UserService
}

// New returns a new instance of DB
func New(dbname, username, password, host, port string) *DB {

	connString := fmt.Sprintf("dbname=%s user=%s password=%s host=%s port=%s sslmode=disable", dbname, username, password, host, port)
	db, err := sqlx.Connect("postgres", connString)
	if err != nil {
		log.Fatalln(err)
	}

	as := &AuthService{
		db: db,
	}

	cs := &ClientService{
		db: db,
	}

	us := &UserService{
		db: db,
	}

	return &DB{
		client:        db,
		authService:   as,
		clientService: cs,
		userService:   us,
	}
}

// Close will close the connection to the DB
func (db *DB) Close() error {
	return db.client.Close()
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
	db.client.MustExec(migrateSQL)
}

// Drop will drop the entire DB
func (db *DB) Drop() {
	_, err := db.client.Exec("DROP SCHEMA public CASCADE;")
	if err != nil {
		log.Println(err)
	}
}
