package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/models"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
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
	formValues := &registerRequest{}
	err = json.Unmarshal(b, formValues)

	log.Println(formValues)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(formValues.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := &models.User{
		FirstName: formValues.First,
		LastName:  formValues.Last,
		Email:     formValues.Email,
		Password:  hashedPassword,
	}

	dbclient := db.Client()
	err = dbclient.UserCreate(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	w.WriteHeader(http.StatusOK)
}
