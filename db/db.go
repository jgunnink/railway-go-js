package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"

	// This imports the PostgreSQL driver
	_ "github.com/lib/pq"
)

var instance *DB

// DB is a container for the sqlx.DB instance
type DB struct {
	DB *sqlx.DB
}

// Init will start the connection to the DB
func Init(dbname, username, password, host, port string) {
	var err error
	db, err := sqlx.Open("postgres", fmt.Sprintf("dbname=%s user=%s password=%s host=%s port=%s sslmode=disable", dbname, username, password, host, port))

	if err != nil {
		log.Fatalln(err)
	}

	instance = &DB{
		DB: db,
	}
}

// Client will return a singleton instance of the DB connection
func Client() *DB {
	if instance == nil {
		log.Fatalln("DB instance not initialised")
	}
	return instance
}
