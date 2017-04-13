package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/helpers"
	"github.com/jgunnink/railway/models"
	"github.com/jmoiron/sqlx/types"
)

type userModelRequest struct {
	Email    string `json:"email"`
	First    string `json:"first"`
	Last     string `json:"last"`
	Password string `json:"password"`
}

// Register takes the HTTP request and attempts to create a user
func Register(w http.ResponseWriter, r *http.Request) {

	log.Println("Registering user...")
	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	formValues := &userModelRequest{}
	err = json.Unmarshal(b, formValues)

	log.Println(formValues)

	hashedPassword := passwords.HashPassword(formValues.Password)

	user := &models.User{
		FirstName: formValues.First,
		LastName:  formValues.Last,
		Email:     formValues.Email,
		Password:  string(hashedPassword),
		Role:      "member",
		Data:      types.JSONText(`{}`),
	}

	dbclient := db.Client()
	err = dbclient.UserCreate(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
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

	log.Println(formValues)

	hashedPassword := passwords.HashPassword(formValues.Password)

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
	log.Println("User account updated.")
}
