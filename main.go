package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/models"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

var helptext = "Welcome to Railway. Server is running."

func main() {
	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println(helptext)
		os.Exit(1)
	}

	db.Init(dbname, dbuser, dbpass, dbhost, dbport)

	for _, arg := range args {
		fmt.Println("Running command:", arg)
		switch arg {
		case "db:drop":
			db.Drop()
		case "db:migrate":
			db.Migrate()
		case "run":
			run()
		default:
			fmt.Printf("%s is not a valid command\n", arg)
			fmt.Println(helptext)
		}
	}
}

func run() {
	rtr := httprouter.New()
	c := cors.Default().Handler(rtr)
	rtr.HandlerFunc("POST", "/register", Register)
	http.ListenAndServe(":8000", c)
}

// Register takes the HTTP request and attempts to create a user
func Register(w http.ResponseWriter, r *http.Request) {

	log.Println("registering user...")

	r.ParseForm()
	firstName := r.FormValue("first")
	lastName := r.FormValue("last")
	email := r.FormValue("email")
	password := r.FormValue("password")
	user := &models.User{
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		Password:  password,
	}

	log.Println(user)

	dbclient := db.Client()
	dbclient.UserCreate(user)
}
