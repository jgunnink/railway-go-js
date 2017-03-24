package server

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/models"
)

// CheckLogin returns a user model if a user a logged in
// 	Route: {{ base_url }}/check_login
// 	Method: GET
// This is an insecure route.
func CheckLogin(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Name:        "checkLogin",
		Description: "Returns a User model if user is logged in",
	}
	log.Println("[HANDLER]", details.Name)
	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	email, ok := session.Values["email"]
	if !ok || email == "" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	sessionIface, ok := session.Values["session_token"]
	if !ok {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	sessionToken := sessionIface.(string)

	dbclient := db.Client()
	result, err := dbclient.UserByEmail(email.(string))
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	if result.SessionToken != sessionToken {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	response, err := json.Marshal(result)
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

// Auth returns a user model if a user a logged in
// 	Route: {{ base_url }}/auth
// 	Method: POST
// This is an insecure route.
func Auth(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Name:        "auth",
		Description: "Create a new user session",
	}
	log.Println("[HANDLER]", details.Name)
	// Check if password matches
	dbclient := db.Client()
	userFromRequest := &models.User{}
	err := json.NewDecoder(r.Body).Decode(userFromRequest)
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Println(string(userFromRequest.Password))
	userFromDB, err := dbclient.UserByEmail(userFromRequest.Email)
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userFromDB.Password), []byte(userFromRequest.Password))
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	// Assign session token
	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
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
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	result := dbclient.UserSetToken(userFromDB.ID, sessionToken)

	response, err := json.Marshal(result)
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

// Logout returns a user model if a user a logged in, and removes the session
// 	Route: {{ base_url }}/logout
// 	Method: DELETE
// This is a secure route.
func Logout(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Name:        "logout",
		Description: "Delete an existing user session",
	}
	log.Println("[HANDLER]", details.Name)
	dbclient := db.Client()

	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	userIDiface, ok := session.Values["id"]
	if !ok {
		handleErrorAndRespond(details, w, "id not in session", http.StatusForbidden)
		return
	}
	userID := userIDiface.(int)

	updatedUser := dbclient.UserLogout(userID)

	response, err := json.Marshal(updatedUser)
	if err != nil {
		handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

// Handles errors responds with an error response struct in JSON
func handleErrorAndRespond(details *funcDetails, w http.ResponseWriter, errString string, code int) {
	log.Println(details.Name, "handler error:", errString)
	w.WriteHeader(code)
	response := &errorResponse{
		Code:    code,
		Error:   errString,
		Message: *details,
	}
	json.NewEncoder(w).Encode(response)
}

type errorResponse struct {
	Code    int         `json:"code"`
	Error   string      `json:"error"`
	Message funcDetails `json:"message"`
}
