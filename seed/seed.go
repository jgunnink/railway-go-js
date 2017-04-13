package seed

import "log"

// Seed will seed the database
func Seed() {
	log.Println("Begin DB Seed")
	seedUsers()
}
