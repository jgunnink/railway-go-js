package seed

import (
	"log"

	"github.com/jgunnink/railway/db"
)

func seedUsers() {
	db := db.Client()
	tx := db.DB.MustBegin()
	log.Println("Seeding users...")
	for _, user := range users {
		tx.MustExec("INSERT INTO users (first_name, last_name, email, password, session_token, role, data) VALUES ($1, $2, $3, $4, $5, $6, $7)", user.FirstName, user.LastName, user.Email, user.Password, user.SessionToken, user.Role, user.Data)
	}

	tx.Commit()
}
