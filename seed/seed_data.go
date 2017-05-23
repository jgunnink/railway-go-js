package seed

import (
	"github.com/jgunnink/railway/helpers"
	"github.com/jgunnink/railway/models"
	"github.com/jmoiron/sqlx/types"
)

var users = []models.User{
	{
		FirstName:    "Member",
		LastName:     "User",
		Email:        "member@example.com",
		Password:     helpers.HashPassword("password"),
		SessionToken: "",
		Role:         "member",
		Data:         types.JSONText(`{"occupation": "User"}`),
	},
	{
		FirstName:    "Admin",
		LastName:     "User",
		Email:        "admin@example.com",
		Password:     helpers.HashPassword("adminpassword"),
		SessionToken: "",
		Role:         "admin",
		Data:         types.JSONText(`{"occupation": "Controller"}`),
	},
}
