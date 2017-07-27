package railway

import (
	"time"
)

// RoleEnum is an enum for user roles
type RoleEnum string

const (
	// RoleAdmin users control everything. Super Users
	RoleAdmin = RoleEnum("admin")
	// RoleManager users are managers of staff
	RoleManager = RoleEnum("manager")
	// RoleStaff users are staff members of an agency
	RoleStaff = RoleEnum("staff")
	// RoleClient users are client users can view projects associated to them
	RoleClient = RoleEnum("client")
	// RoleGuest users are guest users who have signed up for an account
	RoleGuest = RoleEnum("guest")
)

// User represents a single User object in the app
type User struct {
	ID                 int        `json:"id" db:"id"`
	FirstName          string     `json:"firstName" db:"first_name"`
	LastName           string     `json:"lastName" db:"last_name"`
	Email              string     `json:"email" db:"email"`
	Password           string     `json:"password" db:"password"`
	Role               RoleEnum   `json:"role" db:"role"`
	SessionToken       string     `json:"sessionToken" db:"session_token"`
	Data               *UserData  `json:"data" db:"data"`
	ClientID           int        `json:"client_id" db:"client_id"`
	Archived           bool       `json:"archived" db:"archived"`
	ArchivedOn         *time.Time `json:"archived_on" db:"archived_on"`
	Disabled           bool       `json:"disabled" db:"disabled"`
	DisabledOn         *time.Time `json:"disabled_on" db:"disabled_on"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
	PasswordResetToken string     `json:"password_reset_token" db:"password_reset_token"`
}

// Scan will return the fields for pgx to scan into
func (u *User) Scan() []interface{} {
	return []interface{}{
		&u.ID,
		&u.FirstName,
		&u.LastName,
		&u.Email,
		&u.Password,
		&u.Role,
		&u.SessionToken,
		&u.Data,
		&u.ClientID,
		&u.Archived,
		&u.ArchivedOn,
		&u.Disabled,
		&u.DisabledOn,
		&u.CreatedAt,
		&u.PasswordResetToken,
	}
}

// UserCreateRequest is used by the client to create a new user
type UserCreateRequest struct {
	FirstName string    `json:"firstName" db:"first_name"`
	LastName  string    `json:"lastName" db:"last_name"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"password" db:"password"`
	Role      RoleEnum  `json:"role" db:"role"`
	Data      *UserData `json:"data"`
	ClientID  int       `json:"client_id" db:"client_id"`
}

// UserUpdateRequest is used by the client to update an existing user
type UserUpdateRequest struct {
	FirstName string    `json:"firstName" db:"first_name"`
	LastName  string    `json:"lastName" db:"last_name"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"password" db:"password"`
	Role      RoleEnum  `json:"role" db:"role"`
	Data      *UserData `json:"data"`
	ClientID  int       `json:"client_id" db:"client_id"`
}

// UserPasswordReset is used by the client to reset a users password
type UserPasswordReset struct {
	Email              string `json:"email"`
	Password           string `json:"password"`
	PasswordResetToken string `json:"password_reset_token"`
}

// UserData is the JSON data for Users
type UserData struct {
	Avatar string `json:"avatar" db:"avatar"`
}

// UserService is the collection of database methods available for users
type UserService interface {
	UserAll() (map[int]*User, error)
	UserArchive(id int) (*User, error)
	UserUnarchive(id int) (*User, error)
	UserDisable(id int) (*User, error)
	UserEnable(id int) (*User, error)
	UserCreate(user *User) (*User, error)
	UserUpdate(user *User) (*User, error)
	UserByID(id int) (*User, error)
	UserByEmail(email string) (*User, error)
	UsersByClient(clientID int) (map[int]*User, error)
	UserSetResetToken(id int) (string, error)
	UserSetPassword(id int, password string) (*User, error)
}
