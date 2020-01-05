package server

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/sessions"

	"github.com/ninja-software/ninjarouter"
	"github.com/jgunnink/railway"
	"golang.org/x/crypto/bcrypt"
)

// MustDecodeJSON receives a pointer to struct, and updates the struct values
// with the values from the JSON in the http request
func MustDecodeJSON(r *http.Request, target interface{}) {
	err := json.NewDecoder(r.Body).Decode(target)

	if err != nil {
		panic(err)
	}
}

// Error is a struct with which we can marshal into JSON for a HTTP response
type Error struct {
	Message string
}

// ErrorJSON returns a string for use in http.Error
func ErrorJSON(err error) string {
	errResponse := &Error{Message: err.Error()}
	result, err := json.Marshal(errResponse)
	if err != nil {
		panic(err)
	}
	return string(result)
}

// HashPassword encrypts a plaintext string and returns the hashed version
func HashPassword(password string) string {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	return string(hashed)
}

// LoadCookie loads a cookie and checks for valid sessions and returns a cookie
// struct which contains an ID, role and a session token
func LoadCookie(r *http.Request, cs *sessions.CookieStore) (*railway.Cookie, error) {
	session, err := cs.Get(r, cookieName)
	if err != nil {
		return nil, errors.New("could not get session from cookie store")
	}
	userIDIface, ok := session.Values["id"]
	if !ok {
		return nil, errors.New("no ID found with that cookie")
	}
	userID := userIDIface.(int)

	sessionIface, ok := session.Values["session_token"]
	if !ok {
		return nil, errors.New("session token not valid")
	}
	sessionToken := sessionIface.(string)

	roleIface, ok := session.Values["role"]
	if !ok {
		return nil, errors.New("role not valid")
	}
	role := roleIface.(string)

	result := &railway.Cookie{
		UserID:       userID,
		SessionToken: sessionToken,
		Role:         role,
	}

	result.UserID = userID
	result.SessionToken = sessionToken
	return result, nil
}

// NewSessionToken creates exactly that.
func NewSessionToken() string {
	sessionTokenBytes := make([]byte, 32)
	rand.Read(sessionTokenBytes)
	return base64.StdEncoding.EncodeToString(sessionTokenBytes)
}

// updateCookieSession updates a cookie session with passed in values.
func updateCookieSession(cookie *railway.Cookie, session *sessions.Session) *sessions.Session {
	session.Values["session_token"] = cookie.SessionToken
	session.Values["id"] = cookie.UserID
	session.Values["role"] = cookie.Role

	return session
}

func mustGetID(r *http.Request, name string) int {
	nameStr := ninjarouter.Var(r, name)
	nameInt, err := strconv.Atoi(nameStr)
	if err != nil {
		panic(err)
	}
	return nameInt
}

func mustDecodeJSON(r *http.Request, target interface{}) {
	err := json.NewDecoder(r.Body).Decode(target)
	if err != nil {
		panic(err)
	}
}

func marshalAndRespond(w http.ResponseWriter, result interface{}) {
	response, err := json.Marshal(result)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.Write(response)
	}
}
