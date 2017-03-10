package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/models"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"github.com/vulcand/oxy/forward"
	"github.com/vulcand/oxy/testutils"
	"golang.org/x/crypto/bcrypt"
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
	fileshttp := http.NewServeMux()
	fileshttp.Handle("/", http.FileServer(http.Dir("./web/public/")))

	rtr := httprouter.New()

	rtr.HandlerFunc("POST", "/register", Register)
	handler := &Handler{
		APIHandler:   rtr,
		ProxyHandler: ReverseProxy,
		FileServer:   fileshttp,
	}
	c := cors.Default().Handler(handler)
	http.ListenAndServe(":8000", c)
}

// Handler is a collection of all the service handlers.
type Handler struct {
	APIHandler   *httprouter.Router
	ProxyHandler func(http.ResponseWriter, *http.Request)
	FileServer   *http.ServeMux
}

// ServeHTTP delegates a request to the appropriate subhandler.
func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-API") != "" {
		h.APIHandler.ServeHTTP(w, r)
	} else {
		if os.Getenv("PROD") == "" {
			h.ProxyHandler(w, r)
		} else {
			h.FileServer.ServeHTTP(w, r)
		}
	}
}

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
	dbclient.UserCreate(user)
}

// ReverseProxy
func ReverseProxy(w http.ResponseWriter, r *http.Request) {
	r.URL = testutils.ParseURI("http://localhost:3000")
	fwd, err := forward.New()
	if err != nil {
		panic(err)
	}
	fwd.ServeHTTP(w, r)
}
