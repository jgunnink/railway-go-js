package db

import (
	"github.com/jackc/pgx"
	"github.com/jgunnink/railway"
	"github.com/pkg/errors"
)

// This ensures the struct satisfies the interface
var _ railway.AuthService = &AuthService{}

// AuthService contains the methods DB has for users
type AuthService struct {
	db *pgx.ConnPool
}

// SignOut will delete a user's session_token
func (as *AuthService) SignOut(id int) error {
	details := &MethodInfo{
		Name:        "SignOut",
		Description: "SignOut is the DB method used to SignOut",
	}
	tx, err := as.db.Begin()
	_, err = tx.Exec("UPDATE users SET session_token='' WHERE id=$1", id)
	if err != nil {
		return errors.Wrap(err, details.Name)
	}
	return nil
}

// UserSetToken will set a session_token for a given User ID
func (as *AuthService) UserSetToken(id int, sessionToken string) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserSetToken",
		Description: "UserSetToken is the DB method used to UserSetToken",
	}
	updatedUser := &railway.User{}
	query := `
	UPDATE users SET session_token=$1 WHERE id=$2 
	RETURNING
		id,
		first_name,
		last_name,
		email,
		password,
		role,
		session_token,
		data,
		disabled,
		disabled_on,
		archived,
		archived_on,
		created_at,
		password_reset_token
	`
	err := as.db.QueryRow(query, sessionToken, id).Scan(updatedUser.Scan()...)
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	return updatedUser, nil
}
