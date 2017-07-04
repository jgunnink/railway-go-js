package railway

import (
	"time"

	"github.com/jmoiron/sqlx/types"
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
)

// User represents a single User object in the app
type User struct {
	ID           int            `json:"id" db:"id"`
	FirstName    string         `json:"firstName" db:"first_name"`
	LastName     string         `json:"lastName" db:"last_name"`
	Email        string         `json:"email" db:"email"`
	Password     string         `json:"password" db:"password"`
	Role         RoleEnum       `json:"role" db:"role"`
	SessionToken string         `json:"sessionToken" db:"session_token"`
	Data         types.JSONText `json:"data" db:"data"`
	ClientID     int            `json:"client_id" db:"client_id"`
	Archived     bool           `json:"archived" db:"archived"`
	ArchivedOn   *time.Time     `json:"archived_on" db:"archived_on"`
	Disabled     bool           `json:"disabled" db:"disabled"`
	DisabledOn   *time.Time     `json:"disabled_on" db:"disabled_on"`
	CreatedAt    time.Time      `json:"created_at" db:"created_at"`
}

// UserCreateRequest is used by the client to create a new user
type UserCreateRequest struct {
	FirstName string         `json:"firstName" db:"first_name"`
	LastName  string         `json:"lastName" db:"last_name"`
	Email     string         `json:"email" db:"email"`
	Password  string         `json:"password" db:"password"`
	Role      RoleEnum       `json:"role" db:"role"`
	Data      types.JSONText `json:"data" db:"data"`
	ClientID  int            `json:"client_id" db:"client_id"`
}

// UserUpdateRequest is used by the client to create a new user
type UserUpdateRequest struct {
	FirstName string         `json:"firstName" db:"first_name"`
	LastName  string         `json:"lastName" db:"last_name"`
	Email     string         `json:"email" db:"email"`
	Password  string         `json:"password" db:"password"`
	Role      RoleEnum       `json:"role" db:"role"`
	Data      types.JSONText `json:"data" db:"data"`
	ClientID  int            `json:"client_id" db:"client_id"`
}

// UserService is the collection of methods available for users
type UserService interface {
	UserAll() map[int]*User
	UserArchive(id int) *User
	UserUnarchive(id int) *User
	UserDisable(id int) *User
	UserEnable(id int) *User
	UserCreate(user *User) *User
	UserUpdate(user *User) *User
	UserByID(id int) *User
	UserByEmail(email string) *User
	UsersByClient(clientID int) map[int]*User
}
