package helpers

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/jgunnink/railway/models"

	"errors"
)

// LoadCookie loads a cookie and checks for valid sessions and returns a cookie
// struct which contains an ID and a session token
func LoadCookie(r *http.Request, cs *sessions.CookieStore) (*models.Cookie, error) {
	session, err := cs.Get(r, "_railway_session")
	if err != nil {
		return nil, errors.New("could not get session from cookie store")
	}
	result := &models.Cookie{}
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

// UpdateCookieSession updates a cookie session with passed in values.
func UpdateCookieSession(cookie *models.Cookie, session *sessions.Session) *sessions.Session {
	session.Values["session_token"] = cookie.SessionToken
	session.Values["id"] = cookie.UserID

	return session
}
