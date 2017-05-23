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
	userRequest := &userModelRequest{}
	helpers.MustDecodeJSON(r, userRequest)
	log.Println(userRequest)

	hashedPassword := helpers.HashPassword(userRequest.Password)

	user := &models.User{
		FirstName: userRequest.First,
		LastName:  userRequest.Last,
		Email:     userRequest.Email,
		Password:  string(hashedPassword),
		Data:      types.JSONText(`{}`),
	}

	dbclient := db.Client()
	if user.Role == "member" {
		dbclient.MemberCreate(user)
	} else if user.Role == "admin" {
		dbclient.AdminCreate(user)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		return
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
	log.Println("User account updated.")
}
