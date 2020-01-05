package railway

// UserSignInRequest is used by the client to sign in the user
type UserSignInRequest struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

// AuthService is used by the client to set tokens and signout the user
type AuthService interface {
	UserSetToken(id int, sessionToken string) (*User, error)
	SignOut(id int) error
}
