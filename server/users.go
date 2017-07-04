package server

import (
	"log"
	"net/http"
	"time"

	"github.com/blockninja/ninjarouter"
	"github.com/jgunnink/railway"
	"github.com/jmoiron/sqlx/types"
)

// UserController contains the handlers needed for User actions
type UserController struct {
	*ninjarouter.Mux
	UserService railway.UserService
}

// NewUserController creates a new instance of a UserController
func NewUserController(mw railway.MiddlewareService, us railway.UserService) *UserController {
	result := &UserController{
		UserService: us,
		Mux:         ninjarouter.New(),
	}

	result.Mux.GET("/users/all", mw.SecureChain(result.UserAll))
	result.Mux.POST("/users/create", mw.SecureChain(result.UserCreate))
	result.Mux.GET("/users/:id/get", mw.SecureChain(result.UserByID))
	result.Mux.POST("/users/:id/update", mw.SecureChain(result.UserUpdate))
	result.Mux.POST("/users/:id/archive", mw.SecureChain(result.UserArchive))
	result.Mux.POST("/users/:id/unarchive", mw.SecureChain(result.UserUnarchive))
	result.Mux.POST("/users/:id/disable", mw.SecureChain(result.UserDisable))
	result.Mux.POST("/users/:id/enable", mw.SecureChain(result.UserEnable))

	return result
}

// UserCreate will create a new user
// Method = "POST"
// Path = "http://localhost:8080/users/create"
// Description = "Creates a new user in the system"
// END API
func (uc *UserController) UserCreate(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserCreate",
		Description: "UserCreate is the handler for UserCreate",
	}
	log.Println("Run handler:", details.Handler)
	userCreateRequest := &railway.UserCreateRequest{}
	MustDecodeJSON(r, userCreateRequest)

	user := &railway.User{
		FirstName:    userCreateRequest.FirstName,
		LastName:     userCreateRequest.LastName,
		Email:        userCreateRequest.Email,
		Password:     HashPassword(userCreateRequest.Password),
		Role:         userCreateRequest.Role,
		SessionToken: "",
		Data:         types.JSONText(userCreateRequest.Data),
		ClientID:     userCreateRequest.ClientID,
		Disabled:     false,
		DisabledOn:   nil,
		Archived:     false,
		ArchivedOn:   nil,
		CreatedAt:    time.Now(),
	}

	// Check for existing user
	existingUser := uc.UserService.UserByEmail(userCreateRequest.Email)
	if existingUser != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("User with that email already exists"))
		return
	}

	marshalAndRespond(w, uc.UserService.UserCreate(user))

}

// UserByID will return the user given an ID
// Method = "GET"
// Path = "http://localhost:8080/users/:id/get"
// Description = "Gets a user based on their ID"
func (uc *UserController) UserByID(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserByID",
		Description: "UserByID is the handler for UserByID",
	}
	log.Println("Run handler:", details.Handler)
	marshalAndRespond(w, uc.UserService.UserByID(mustGetID(r, "id")))
}

// UserAll will return all non-archived sites
// Method = "GET"
// Path = "http://localhost:8080/users/all"
// Description = "Gets all non-archived sites"
func (uc *UserController) UserAll(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserAll",
		Description: "UserAll is the handler for UserAll",
	}
	log.Println("Run handler:", details.Handler)
	cookie, err := LoadCookie(r, cookieStore)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user := uc.UserService.UserByID(cookie.UserID)
	if user.Role == railway.RoleOrangeAdmin {
		marshalAndRespond(w, uc.UserService.UserAll())
		return
	}

	marshalAndRespond(w, uc.UserService.UsersByClient(user.ClientID))
}

// UserUpdate will update the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/user/:id/update"
// Description = "Updates a user given an ID"
func (uc *UserController) UserUpdate(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserUpdate",
		Description: "UserUpdate is the handler for UserUpdate",
	}
	log.Println("Run handler:", details.Handler)

	userID := mustGetID(r, "id")
	user := uc.UserService.UserByID(userID)

	mustDecodeJSON(r, user)

	result := uc.UserService.UserUpdate(user)
	marshalAndRespond(w, result)
}

// UserArchive will archive then return the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/users/:id/archive"
// Description = "Archives a user based on their ID"
func (uc *UserController) UserArchive(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserArchive",
		Description: "UserArchive is the handler for UserArchive",
	}
	log.Println("Run handler:", details.Handler)

	marshalAndRespond(w, uc.UserService.UserArchive(mustGetID(r, "id")))
}

// UserUnarchive will unarchive then return the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/users/:id/unarchive"
// Description = "Archives a user based on their ID"
func (uc *UserController) UserUnarchive(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserUnarchive",
		Description: "UserUnarchive is the handler for UserUnarchive",
	}
	log.Println("Run handler:", details.Handler)

	marshalAndRespond(w, uc.UserService.UserUnarchive(mustGetID(r, "id")))
}

// UserDisable will disable then return the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/users/:id/disable"
// Description = "Archives a user based on their ID"
func (uc *UserController) UserDisable(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserDisable",
		Description: "UserDisable is the handler for UserDisable",
	}
	log.Println("Run handler:", details.Handler)

	marshalAndRespond(w, uc.UserService.UserDisable(mustGetID(r, "id")))
}

// UserEnable will enable then return the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/users/:id/enable"
// Description = "Archives a user based on their ID"
func (uc *UserController) UserEnable(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserEnable",
		Description: "UserEnable is the handler for UserEnable",
	}
	log.Println("Run handler:", details.Handler)

	marshalAndRespond(w, uc.UserService.UserEnable(mustGetID(r, "id")))
}
