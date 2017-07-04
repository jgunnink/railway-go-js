package railway

import (
	"net/http"
)

// Cookie contains the email and cookie of the users session
type Cookie struct {
	UserID       int    `json:"user_id"`
	Role         string `json:"role"`
	SessionToken string `json:"session_token"`
}

// MiddlewareService contains the middleware methods available to the app
type MiddlewareService interface {
	AdminChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request)
	StaffChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request)
	SecureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request)
	InsecureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request)
}

// HTTPService are the CLI app methods, used to interface with a running server
// It ultimately wraps the endpoints available from the server
type HTTPService interface {
	UserCreate(*UserCreateRequest) error
	UserSignIn(*UserSignInRequest) error
	ClientCreate(*ClientCreateRequest) error
	ClientAll() (map[int]*Client, error)
}
