package db

import (
	"log"
	"time"

	"github.com/jgunnink/railway/models"
)

// userCreate saves a new USER to the database given a USER
func (db *DB) userCreate(user *models.User) error {
	stmt, err := db.DB.PrepareNamed(`
INSERT INTO users (first_name, last_name, email, password, session_token, data, role, archived_on)
VALUES (:first_name, :last_name, :email, :password, :session_token, :data, :role, NULL)
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

// MemberCreate will create a user with the required role
func (db *DB) MemberCreate(user *models.User) error {
	user.Role = "member"
	err := db.userCreate(user)
	if err != nil {
		return err
	}
	return nil
}

// AdminCreate will create a user with the required role
func (db *DB) AdminCreate(user *models.User) error {
	user.Role = "admin"
	err := db.userCreate(user)
	if err != nil {
		return err
	}
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
	err := db.DB.Select(&users, "SELECT * FROM users WHERE archived=false")
	if err != nil {
		panic(err)
	}

	return users
}

// UserArchive will archive a user.
func (db *DB) UserArchive(id int) (*models.User, error) {
	archivedUser := &models.User{}
	err := db.DB.Get(archivedUser, "UPDATE users SET archived=true, archived_on=$1 WHERE id=$2 RETURNING *", time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return archivedUser, nil
}

// UserByEmail returns a single User given an email
func (db *DB) UserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	err := db.DB.Get(user, "SELECT * FROM users WHERE email=$1", email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserSetToken will set a session_token for a given User ID
func (db *DB) UserSetToken(id int, sessionToken string) *models.User {
	updatedUser := &models.User{}
	err := db.DB.Get(updatedUser, "UPDATE users SET session_token=$1 WHERE id=$2 RETURNING *", sessionToken, id)
	if err != nil {
		panic(err)
	}

	return updatedUser
}

// UserLogout will delete a user's session_token
func (db *DB) UserLogout(id int) *models.User {
	updatedUser := &models.User{}
	err := db.DB.Get(updatedUser, "UPDATE users SET session_token='' WHERE id=$1 RETURNING *", id)
	if err != nil {
		panic(err)
	}

	return updatedUser
}

// UserUpdate updates an existing user account to the database.
func (db *DB) UserUpdate(user *models.User) error {
	tx := db.DB.MustBegin()

	stmt, err := tx.PrepareNamed(`UPDATE users SET id=:id,
	first_name=:first_name,
	last_name=:last_name,
	email=:email,
	password=:password
	WHERE id=:id
`)
	if err != nil {
		return err
	}

	stmt.MustExec(user)
	tx.Commit()
	return nil
}
