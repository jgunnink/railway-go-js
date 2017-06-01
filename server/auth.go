package server

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/httperrors"
	"github.com/jgunnink/railway/models"
)

// CheckLogin returns a user model if a user a logged in
// 	Route: {{ base_url }}/check_login
// 	Method: GET
// This is an insecure route.
func CheckLogin(w http.ResponseWriter, r *http.Request) {
	details := &FuncDetails{
		name:        "checkLogin",
		description: "Returns a User model if user is logged in",
	}
	log.Println("[HANDLER]", details.Name)
	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	email, ok := session.Values["email"]
	if !ok || email == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	sessionIface, ok := session.Values["session_token"]
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	sessionToken := sessionIface.(string)

	dbclient := db.Client()
	result, err := dbclient.UserByEmail(email.(string))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if result.SessionToken != sessionToken {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	response, err := json.Marshal(result)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

type loginResponse struct {
	ID           int    `json:"user_id"`
	SessionToken string `json:"sessionToken"`
}

// Auth returns a user model if a user a logged in
// 	Route: {{ base_url }}/auth
// 	Method: POST
// This is an insecure route.
func Auth(w http.ResponseWriter, r *http.Request) {
	details := &FuncDetails{
		name:        "auth",
		description: "Create a new user session",
	}
	log.Println("[HANDLER]", details.Name)
	// Check if password matches
	dbclient := db.Client()
	userFromRequest := &models.User{}
	err := json.NewDecoder(r.Body).Decode(userFromRequest)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	userFromDB, err := dbclient.UserByEmail(userFromRequest.Email)
	if err != nil {
		httperrors.HandleErrorAndRespond(w, httperrors.StatusPasswordMismatch, http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userFromDB.Password), []byte(userFromRequest.Password))
	if err != nil {
		httperrors.HandleErrorAndRespond(w, httperrors.StatusPasswordMismatch, http.StatusUnauthorized)
		return
	}

	// Assign session token
	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sessionTokenBytes := make([]byte, 32)
	rand.Read(sessionTokenBytes)
	sessionToken := base64.StdEncoding.EncodeToString(sessionTokenBytes)

	session.Values["session_token"] = string(sessionToken)
	session.Values["email"] = userFromDB.Email
	session.Values["id"] = userFromDB.ID
	err = session.Save(r, w)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	result := dbclient.UserSetToken(userFromDB.ID, sessionToken)

	response, err := json.Marshal(result)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

// Logout returns a user model if a user a logged in, and removes the session
// 	Route: {{ base_url }}/logout
// 	Method: DELETE
// This is a secure route.
func Logout(w http.ResponseWriter, r *http.Request) {
	details := &FuncDetails{
		name:        "logout",
		description: "Delete an existing user session",
	}
	log.Println("[HANDLER]", details.Name)
	dbclient := db.Client()

	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userIDiface, ok := session.Values["id"]
	if !ok {
		httperrors.HandleErrorAndRespond(w, httperrors.IDNotInSession, http.StatusUnauthorized)
		return
	}
	userID := userIDiface.(int)

	updatedUser := dbclient.UserLogout(userID)

	response, err := json.Marshal(updatedUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(response)
}
