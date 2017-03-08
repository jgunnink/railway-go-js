package db

import "log"

// Drop will drop the following tables:
// clients
// projects
// users
func Drop() {

	_, err := instance.DB.Exec("DROP SCHEMA public CASCADE;")
	if err != nil {
		log.Println(err)
	}
	log.Println("Database dropped")

}
