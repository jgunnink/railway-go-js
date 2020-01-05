package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/jgunnink/railway"
	"github.com/ninja-software/ninjarouter"
	"golang.org/x/crypto/bcrypt"
)

// AuthController contains the handlers needed for authenticationn actions
type AuthController struct {
	*ninjarouter.Mux
	AuthService railway.AuthService
	UserService railway.UserService
}

// NewAuthController creates a new instance of a AuthController
func NewAuthController(mw railway.MiddlewareService, as railway.AuthService, us railway.UserService) *AuthController {
	result := &AuthController{
		AuthService: as,
		UserService: us,
		Mux:         ninjarouter.New(),
	}

	result.Mux.GET("/auth/check", mw.InsecureChain(result.Check))
	result.Mux.POST("/auth/sign_in", mw.InsecureChain(result.SignIn))
	result.Mux.DELETE("/auth/sign_out", mw.SecureChain(result.SignOut))

	return result
}

// SignIn returns a user model if a user a logged in
// 	Route: {{ base_url }}/auth/sign_in
// 	Method: POST
// This is an insecure route.
func (ac *AuthController) SignIn(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "SignIn",
		Description: "SignIn is the handler for SignIn",
	}
	log.Println("HANDLER: " + details.Handler)

	// Check if password matches
	userFromRequest := &railway.UserSignInRequest{}
	err := json.NewDecoder(r.Body).Decode(userFromRequest)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userFromDB, err := ac.UserService.UserByEmail(userFromRequest.Email)
	if err != nil {
		log.Println(err)
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}

	//Check a user account is not disabled
	if userFromDB.Disabled {
		HandleErrorAndRespond(w, ErrorAccountDisabled, http.StatusUnauthorized)
	}

	err = bcrypt.CompareHashAndPassword([]byte(userFromDB.Password), []byte(userFromRequest.Password))
	if err != nil {
		HandleErrorAndRespond(w, ErrorPasswordMismatch, http.StatusUnauthorized)
		return
	}

	// Assign session token
	session, err := cookieStore.Get(r, cookieName)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	newCookie := &railway.Cookie{
		SessionToken: userFromDB.SessionToken,
		Role:         string(userFromDB.Role),
		UserID:       userFromDB.ID,
	}

	updatedSession := updateCookieSession(newCookie, session)

	err = updatedSession.Save(r, w)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	result, err := ac.AuthService.UserSetToken(userFromDB.ID, newCookie.SessionToken)
	if err != nil {
		log.Println(err)
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(result)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(response)
}

// SignOut returns a user model if a user a logged in, and removes the session
// 	Route: {{ base_url }}/sign_out
// 	Method: DELETE
// This is a secure route.
func (ac *AuthController) SignOut(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "sign_out",
		Description: "Delete an existing user session",
	}
	log.Println("HANDLER: " + details.Handler)

	cookie, err := LoadCookie(r, cookieStore)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	ac.AuthService.SignOut(cookie.UserID)
	log.Println("signout success")
}

// Check returns a user model if a user a logged in, 403 otherwise
// Route: {{ base_url }}/check
// Method: GET
// This is a secure route.
func (ac *AuthController) Check(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "check",
		Description: "Check if a user is already logged in",
	}
	log.Println("HANDLER: " + details.Handler)
	cookie, err := LoadCookie(r, cookieStore)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		log.Println(err)
		return
	}

	user, err := ac.UserService.UserByID(cookie.UserID)
	if err != nil {
		log.Println(err)
		HandleErrorAndRespond(w, ErrorDatabaseQuery, http.StatusInternalServerError)
		return
	}

	if cookie.SessionToken != user.SessionToken {
		HandleErrorAndRespond(w, ErrorEmailTokenMismatch, http.StatusUnauthorized)
		return
	}
	marshalAndRespond(w, cookie)

}
