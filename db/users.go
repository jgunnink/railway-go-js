package db

import (
	"fmt"
	"time"

	"github.com/jackc/pgx"
	"github.com/jgunnink/railway"
	"github.com/pkg/errors"
	uuid "github.com/satori/go.uuid"
)

// This ensures the struct satisfies the interface
var _ railway.UserService = &UserService{}

// UserService contains the methods DB has for Users
type UserService struct {
	db *pgx.ConnPool
}

const userAllColumns = `
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

// UserCreate saves a new USER to the database given a USER
func (us *UserService) UserCreate(user *railway.User) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserCreate",
		Description: "UserCreate is the DB method used to UserCreate",
	}
	newUser := &railway.User{}
	query := fmt.Sprintf(`
	INSERT INTO users (first_name, last_name, email, password, session_token, data, role, archived, disabled, archived_on, disabled_on)
	VALUES ($1, $2, $3, $4, $5, '{}', $6, false, false, NULL, NULL)
	RETURNING %s
`, userAllColumns)

	err := us.db.QueryRow(query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
		user.SessionToken,
		user.Role,
	).Scan(newUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	return newUser, nil
}

// UserAll returns all active Users which are unarchived
func (us *UserService) UserAll() (map[int]*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserAll",
		Description: "UserAll is the DB method used to UserAll",
	}
	query := fmt.Sprintf(`
		SELECT %s
		FROM users 
		WHERE archived=false
`, userAllColumns)
	rows, err := us.db.Query(query)
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}
	result := map[int]*railway.User{}
	for rows.Next() {
		tempUser := &railway.User{}
		rows.Scan(tempUser.Scan())
		result[tempUser.ID] = tempUser
	}
	rows.Close()

	return result, nil
}

// UserArchive will archive a User.
func (us *UserService) UserArchive(id int) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserArchive",
		Description: "UserArchive is the DB method used to UserArchive",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	query := fmt.Sprintf(`
	UPDATE users SET archived=true, archived_on=$1 WHERE id=$2 
	RETURNING %s
`, userAllColumns)
	archivedUser := &railway.User{}
	err = tx.QueryRow(query, time.Now().UTC().Format(time.RFC3339), id).Scan(archivedUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()
	return archivedUser, nil
}

// UserUnarchive will unarchive a user.
func (us *UserService) UserUnarchive(id int) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserUnarchive",
		Description: "UserUnarchive is the DB method used to UserUnarchive",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	unarchivedUser := &railway.User{}
	query := fmt.Sprintf(`
	UPDATE users SET archived=false, archived_on=null WHERE id=$1 
	RETURNING %s
`, userAllColumns)
	err = tx.QueryRow(query, id).Scan(unarchivedUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()

	return unarchivedUser, nil
}

// UserDisable will disable a user.
func (us *UserService) UserDisable(id int) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserDisable",
		Description: "UserDisable is the DB method used to UserDisable",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	disabledUser := &railway.User{}
	query := fmt.Sprintf(`
	UPDATE users
	SET disabled=true, disabled_on=$1 
	WHERE id=$2 
	RETURNING %s
`, userAllColumns)

	err = tx.QueryRow(query, time.Now().UTC().Format(time.RFC3339), id).Scan(disabledUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()

	return disabledUser, nil
}

// UserEnable will enable a user.
func (us *UserService) UserEnable(id int) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserEnable",
		Description: "UserEnable is the DB method used to UserEnable",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	enabledUser := &railway.User{}
	query := fmt.Sprintf(`
	UPDATE users 
	SET disabled=false, disabled_on=null 
	WHERE id=$1 
	RETURNING %s
`, userAllColumns)
	err = tx.QueryRow(query, id).Scan(enabledUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()

	return enabledUser, nil
}

// UserByEmail returns a single User given an email
func (us *UserService) UserByEmail(email string) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserByEmail",
		Description: "UserByEmail is the DB method used to UserByEmail",
	}

	user := &railway.User{}
	query := fmt.Sprintf(`
		SELECT %s
		FROM users
		WHERE email=$1
`, userAllColumns)
	err := us.db.QueryRow(query, email).Scan(user.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
		// We return nil here since no returned rows are a good thing!
	}

	return user, nil
}

// UserByID returns a single User given an ID
func (us *UserService) UserByID(id int) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserByID",
		Description: "UserByID is the DB method used to find a UserByID",
	}
	user := &railway.User{}
	query := fmt.Sprintf(`
		SELECT %s
		FROM users
		WHERE id=$1
`, userAllColumns)
	err := us.db.QueryRow(query, id).Scan(user.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	return user, nil
}

// UserSetToken will set a session_token for a given User ID
func (us *UserService) UserSetToken(id int, sessionToken string) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserSetToken",
		Description: "UserSetToken is the DB method used to UserSetToken",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	updatedUser := &railway.User{}
	query := fmt.Sprintf(`
	UPDATE users
	SET session_token=$1 
	WHERE id=$2
	RETURNING %s
`, userAllColumns)
	err = tx.QueryRow(query, sessionToken, id).Scan(updatedUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()
	return updatedUser, nil
}

// UserUpdate updates an existing user account to the database.
func (us *UserService) UserUpdate(user *railway.User) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserUpdate",
		Description: "UserUpdate is the DB method used to UserUpdate",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	query := fmt.Sprintf(`
	UPDATE users 
	SET first_name=$1,
		last_name=$2,
		email=$3,
		password=$4
	WHERE id=$5
	RETURNING %s
`, userAllColumns)

	updatedUser := &railway.User{}
	err = tx.QueryRow(query, user.FirstName, user.LastName, user.Email, user.Password, user.ID).Scan(updatedUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()
	return updatedUser, nil
}

// UserSetResetToken creates a reset token the user can use to reset their
// password in the database.
func (us *UserService) UserSetResetToken(id int) (string, error) {
	details := &MethodInfo{
		Name:        "UserSetResetToken",
		Description: "UserSetResetToken is the DB method used to UserSetResetToken",
	}
	token := uuid.NewV4().String()
	tx, err := us.db.Begin()
	if err != nil {
		return "", errors.Wrap(err, details.Name)
	}

	query := `
	UPDATE users
	SET password_reset_token=$1
	WHERE id=$2
`

	tx.QueryRow(query, token, id).Scan()
	tx.Commit()
	return token, nil
}

// UserSetPassword updates only the password fields in the database
// password in the database.
func (us *UserService) UserSetPassword(id int, hashedPassword string) (*railway.User, error) {
	details := &MethodInfo{
		Name:        "UserSetPassword",
		Description: "UserSetPassword is the DB method used to UserSetPassword",
	}
	tx, err := us.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	updatedUser := &railway.User{}
	query := fmt.Sprintf(`
	UPDATE users
	SET password=$1,
		password_reset_token=''
	WHERE id=$2
	RETURNING %s
`, userAllColumns)

	err = tx.QueryRow(query, hashedPassword, id).Scan(updatedUser.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}
	tx.Commit()
	return updatedUser, nil
}

// UsersByClient returns all active users which are unarchived for a specific client
func (us *UserService) UsersByClient(clientID int) (map[int]*railway.User, error) {
	details := &MethodInfo{
		Name:        "UsersByClient",
		Description: "UsersByClient is the DB method used to UsersByClient",
	}
	query := fmt.Sprintf(`
		SELECT %s
		FROM users 
		WHERE archived=false
		AND client_id=$1
`, userAllColumns)
	rows, err := us.db.Query(query)
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}
	result := map[int]*railway.User{}
	for rows.Next() {
		tempUser := &railway.User{}
		rows.Scan(tempUser.Scan())
		result[tempUser.ID] = tempUser
	}
	rows.Close()

	return result, nil
}
