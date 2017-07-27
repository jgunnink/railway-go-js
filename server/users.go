package server

import (
	"log"
	"net/http"
	"time"

	"github.com/blockninja/monocular"
	"github.com/blockninja/ninjarouter"
	"github.com/jgunnink/railway"
	"github.com/jgunnink/railway/helpers"
	"github.com/pkg/errors"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
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

	result.Mux.GET("/users/all", mw.AdminChain(result.UserAll))
	result.Mux.POST("/users/create", mw.AdminChain(result.UserCreate))
	result.Mux.POST("/users/registration", mw.InsecureChain(result.UserCreate))
	result.Mux.GET("/users/:id/get", mw.StaffChain(result.UserByID))
	result.Mux.POST("/users/:id/update", mw.StaffChain(result.UserUpdate))
	result.Mux.POST("/users/:id/archive", mw.AdminChain(result.UserArchive))
	result.Mux.POST("/users/:id/unarchive", mw.AdminChain(result.UserUnarchive))
	result.Mux.POST("/users/:id/disable", mw.AdminChain(result.UserDisable))
	result.Mux.POST("/users/:id/enable", mw.AdminChain(result.UserEnable))
	result.Mux.POST("/users/:id/passwordreset", mw.AdminChain(result.UserSetResetToken))
	result.Mux.POST("/users/passwordreset", mw.InsecureChain(result.UserPasswordReset))

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
		Data:         userCreateRequest.Data,
		ClientID:     userCreateRequest.ClientID,
		Disabled:     false,
		DisabledOn:   nil,
		Archived:     false,
		ArchivedOn:   nil,
		CreatedAt:    time.Now(),
	}

	// Check for existing user
	existingUser, _ := uc.UserService.UserByEmail(userCreateRequest.Email)
	if existingUser != nil {
		HandleErrorAndRespond(w, ErrorDuplicateEmail, http.StatusBadRequest)
		return
	}

	result, err := uc.UserService.UserCreate(user)
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}

	marshalAndRespond(w, result)
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
	result, err := uc.UserService.UserByID(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	log.Println("Run handler:", details.Handler)
	marshalAndRespond(w, result)
}

// UserAll will return all non-archived users
// Method = "GET"
// Path = "http://localhost:8080/users/all"
// Description = "Gets all non-archived sites"
func (uc *UserController) UserAll(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserAll",
		Description: "UserAll is the handler for UserAll",
	}
	log.Println("Run handler:", details.Handler)

	result, err := uc.UserService.UserAll()
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
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
	user, err := uc.UserService.UserByID(userID)
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}

	mustDecodeJSON(r, user)

	result, err := uc.UserService.UserUpdate(user)
	if err != nil {
		return
	}
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

	result, err := uc.UserService.UserArchive(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
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

	result, err := uc.UserService.UserUnarchive(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
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

	result, err := uc.UserService.UserDisable(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
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

	result, err := uc.UserService.UserEnable(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
}

// UserSetResetToken will send a password reset email to the user given an ID
// Method = "POST"
// Path = "http://localhost:8080/users/:id/passwordreset"
// Description = "Sends a password reset email a user based on an ID"
func (uc *UserController) UserSetResetToken(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserSetResetToken",
		Description: "UserSetResetToken is the handler for UserSetResetToken",
	}
	log.Println("Run handler:", details.Handler)

	user, err := uc.UserService.UserByID(mustGetID(r, "id"))
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	token, err := uc.UserService.UserSetResetToken(user.ID)
	host := r.Host // Eg: localhost:8080
	resetLink := "https://" + host + "/users/passwordreset/" + token

	log.Println("Sending password reset email to", user.Email)
	from := mail.NewEmail("Railway Admin", "noreply@railwayapp.com")
	subject := "Reset your Railway password"
	to := mail.NewEmail(user.FirstName+user.LastName, user.Email)
	content := mail.NewContent("text/html", `

<p>Hello!</p>

<p>You or your administrator has sent through a request to reset
your password. You can do that by clicking the following link:</p>
	
<p>`+resetLink+`</p>

<p>Regards from Railway admin team</p>`)
	m := mail.NewV3MailInit(from, subject, to, content)
	request := sendgrid.GetRequest(sendgridAPIKey, "/v3/mail/send", "https://api.sendgrid.com")
	request.Method = "POST"
	request.Body = mail.GetRequestBody(m)
	_, err = sendgrid.API(request)
	if err != nil {
		log.Println(err)
		log.Println(errors.Wrap(err, "Could not send password reset email"))
	} else {
		log.Println("Password reset email sent to", user.Email)
	}
}

// UserPasswordReset will reset a password given a token
// Method = "POST"
// Path = "http://localhost:8080/users/passwordreset/"
// Description = "Resets a users password given a token"
func (uc *UserController) UserPasswordReset(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserPasswordReset",
		Description: "UserPasswordReset is the handler for UserPasswordReset",
	}
	log.Println("Run handler:", details.Handler)

	request := &monocular.UserPasswordReset{}
	mustDecodeJSON(r, request)

	user, err := uc.UserService.UserByEmail(request.Email)
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	existingToken := user.PasswordResetToken
	hashedPassword := helpers.HashPassword(request.Password)

	if existingToken != request.PasswordResetToken {
		HandleErrorAndRespond(w, ErrorPasswordResetTokenMismatch, http.StatusUnauthorized)
		return
	}

	result, err := uc.UserService.UserSetPassword(user.ID, hashedPassword)
	if err != nil {
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}
	marshalAndRespond(w, result)
}
