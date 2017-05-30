package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/blockninja/ninjarouter"
	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/helpers"
	"github.com/jgunnink/railway/models"
)

// UserAll returns all users in the database
// 	Route: {{ base_url }}/admin/users
// 	Method: GET
// This is a secure route for ADMIN users
func UserAll(w http.ResponseWriter, r *http.Request) {
	dbclient := db.Client()
	allUsers := dbclient.UserAll()

	users, err := json.Marshal(allUsers)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(users)
}

// UserArchive archives the given user
//  Route: {{ base_url }}/archive/:id
// 	Method: POST
// This is a secure route for ADMIN users
func UserArchive(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.Atoi(ninjarouter.Var(r, "id"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println("Didn't get an int back from lookup")
		return
	}

	dbclient := db.Client()
	archiveUser, err := dbclient.UserArchive(userID)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	archivedUser, err := json.Marshal(archiveUser)
	w.Write(archivedUser)
}

// UserUpdate takes the HTTP request and attempts to update the user record in the database
func UserUpdate(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	formValues := &userModelRequest{}
	err = json.Unmarshal(b, formValues)

	hashedPassword := helpers.HashPassword(formValues.Password)
	dbclient := db.Client()

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Get the user ID of the user we are attempting to update
	session, err := cookieStore.Get(r, "_railway_session")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userID, ok := session.Values["id"]
	if !ok || userID == "" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	updatedUser := &models.User{
		ID:        userID.(int),
		FirstName: formValues.First,
		LastName:  formValues.Last,
		Email:     formValues.Email,
		Password:  string(hashedPassword),
	}

	err = dbclient.UserUpdate(updatedUser)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	resp, err := json.Marshal(updatedUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(resp)
}
