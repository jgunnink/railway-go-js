package db

import (
	"log"
	"time"

	"github.com/jgunnink/railway"

	"github.com/jmoiron/sqlx"
)

// This ensures the struct satisfies the interface
var _ railway.UserService = &UserService{}

// UserService contains the methods DB has for users
type UserService struct {
	db *sqlx.DB
}

// UserCreate saves a new USER to the database given a USER
func (us *UserService) UserCreate(user *railway.User) *railway.User {
	dest := &railway.User{}
	query := `
INSERT INTO users (first_name, last_name, email, password, session_token, data, client_id, role, archived, disabled, archived_on, disabled_on)
VALUES (:first_name, :last_name, :email, :password, :session_token, :data, :client_id, :role, false, false, NULL, NULL)
RETURNING *
`
	stmt, err := us.db.PrepareNamed(query)
	if err != nil {
		panic(err)
	}
	stmt.MustExec(user)

	log.Println("New user created:", user.FirstName+" "+user.LastName)
	return us.UserByID(dest.ID)
}

// UserAll returns all active users which are unarchived
func (us *UserService) UserAll() map[int]*railway.User {
	users := []*railway.User{}
	err := us.db.Select(&users, "SELECT * FROM users WHERE archived=false")
	if err != nil {
		panic(err)
	}
	result := map[int]*railway.User{}
	for _, user := range users {
		result[user.ID] = user
	}
	return result
}

// UserArchive will archive a user.
func (us *UserService) UserArchive(id int) *railway.User {
	archivedUser := &railway.User{}
	err := us.db.Get(archivedUser, "UPDATE users SET archived=true, archived_on=$1 WHERE id=$2 RETURNING *", time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		panic(err)
	}

	return archivedUser
}

// UserUnarchive will unarchive a user.
func (us *UserService) UserUnarchive(id int) *railway.User {
	unarchivedUser := &railway.User{}
	err := us.db.Get(unarchivedUser, "UPDATE users SET archived=false, archived_on=null WHERE id=$1 RETURNING *", id)
	if err != nil {
		panic(err)
	}

	return unarchivedUser
}

// UserDisable will disable a user.
func (us *UserService) UserDisable(id int) *railway.User {
	disabledUser := &railway.User{}
	err := us.db.Get(disabledUser, "UPDATE users SET disabled=true, disabled_on=$1 WHERE id=$2 RETURNING *", time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		panic(err)
	}

	return disabledUser
}

// UserEnable will enable a user.
func (us *UserService) UserEnable(id int) *railway.User {
	enabledUser := &railway.User{}
	err := us.db.Get(enabledUser, "UPDATE users SET disabled=false, disabled_on=null WHERE id=$1 RETURNING *", id)
	if err != nil {
		panic(err)
	}

	return enabledUser
}

// UserByEmail returns a single User given an email
func (us *UserService) UserByEmail(email string) *railway.User {
	user := &railway.User{}
	err := us.db.Get(user, "SELECT * FROM users WHERE email=$1", email)
	if err != nil {
		return nil
	}

	return user
}

// UserByID returns a single User given an ID
func (us *UserService) UserByID(ID int) *railway.User {
	user := &railway.User{}
	err := us.db.Get(user, "SELECT * FROM users WHERE ID=$1", ID)
	if err != nil {
		return nil
	}

	return user
}

// UsersByClient returns all active users which are unarchived for a specific client
func (us *UserService) UsersByClient(clientID int) map[int]*railway.User {
	users := []*railway.User{}
	mustSelect(us.db, &users, "SELECT * FROM users WHERE archived=false AND client_id=$1", clientID)

	result := map[int]*railway.User{}
	for _, user := range users {
		result[user.ID] = user
	}
	return result
}

// UserSetToken will set a session_token for a given User ID
func (us *UserService) UserSetToken(id int, sessionToken string) *railway.User {
	updatedUser := &railway.User{}
	err := us.db.Get(updatedUser, "UPDATE users SET session_token=$1 WHERE id=$2 RETURNING *", sessionToken, id)
	if err != nil {
		panic(err)
	}

	return updatedUser
}

// UserUpdate updates an existing user account to the database.
func (us *UserService) UserUpdate(user *railway.User) *railway.User {

	query := `
	UPDATE users 
	SET first_name=$1,
		last_name=$2,
		email=$3,
		password=$4
	WHERE id=$5
	RETURNING id
`
	var id int
	mustGet(us.db, &id, query, user.FirstName, user.LastName, user.Email, user.Password, user.ID)

	log.Println("User updated:", user.FirstName)
	return us.UserByID(id)
}
