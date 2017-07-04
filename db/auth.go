package db

import (
	"log"

	"github.com/jgunnink/railway"
	"github.com/jmoiron/sqlx"
)

// This ensures the struct satisfies the interface
var _ railway.AuthService = &AuthService{}

// AuthService contains the methods DB has for users
type AuthService struct {
	db *sqlx.DB
}

// SignOut will delete a user's session_token
func (as *AuthService) SignOut(id int) {
	updatedUser := &railway.User{}
	err := as.db.Get(updatedUser, "UPDATE users SET session_token='' WHERE id=$1 RETURNING *", id)
	if err != nil {
		panic(err)
	}
}

// UserSetToken will set a session_token for a given User ID
func (as *AuthService) UserSetToken(id int, sessionToken string) *railway.User {
	updatedUser := &railway.User{}
	err := as.db.Get(updatedUser, "UPDATE users SET session_token=$1 WHERE id=$2 RETURNING *", sessionToken, id)
	if err != nil {
		log.Println("panic here! :D")
		panic(err)
	}

	return updatedUser
}
