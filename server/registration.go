package server

import (
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
	if user.Role == "admin" {
		err := dbclient.AdminCreate(user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	} else {
		err := dbclient.MemberCreate(user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}
}
