package models

import "github.com/jmoiron/sqlx/types"

// User contains the columns for the users of the web application.
type User struct {
	ID           int            `json:"id" db:"id"`
	FirstName    string         `json:"firstName" db:"first_name"`
	LastName     string         `json:"lastName" db:"last_name"`
	Email        string         `json:"email" db:"email"`
	Password     string         `json:"password" db:"password"`
	SessionToken string         `json:"sessionToken" db:"session_token"`
	Data         types.JSONText `json:"data" db:"data"`
}
