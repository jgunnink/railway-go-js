package db

import (
	"log"

	"github.com/jgunnink/railway/models"
)

// UserCreate saves a new USER to the database given a USER
func (db *DB) UserCreate(user *models.User) error {
	stmt, err := db.DB.PrepareNamed(`
INSERT INTO users (first_name, last_name, email, password, session_token, data)
VALUES (:first_name, :last_name, :email, :password, :session_token, :data)
`)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(user)
	if err != nil {
		return err
	}
	log.Println("New user created: " + user.Email)
	return nil
}

// User returns a single User given an ID
func (db *DB) User(id int) *models.User {
	user := &models.User{}
	err := db.DB.Get(user, "SELECT * FROM users WHERE id=$1", id)
	if err != nil {
		panic(err)
	}
	return user
}

// UserAll returns all users
func (db *DB) UserAll() []*models.User {
	users := []*models.User{}
	err := db.DB.Select(&users, "SELECT * FROM users")
	if err != nil {
		panic(err)
	}

	return users
}
