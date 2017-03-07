package db

import (
	"io/ioutil"
	"log"
)

// Migrate will begin the database migration
func Migrate() {
	log.Println("Begin DB migration")
	schema, err := ioutil.ReadFile("./db/migrate.sql")
	if err != nil {
		log.Fatalln(err)
	}
	instance.DB.MustExec(string(schema))

}
