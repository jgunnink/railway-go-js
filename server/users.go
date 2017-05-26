package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

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
	user, err := dbclient.UserByEmail(formValues.Email)

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	updatedUser := &models.User{
		ID:        user.ID,
		FirstName: formValues.First,
		LastName:  formValues.Last,
		Email:     formValues.Email,
		Password:  string(hashedPassword),
	}
	err = dbclient.UserUpdate(updatedUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
