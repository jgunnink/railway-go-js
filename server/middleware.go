package server

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/jgunnink/railway"
)

// Middleware contains the auth chains used in this app
type Middleware struct {
	railway.UserService
}

// NewMiddleware returns a new instance of Middleware
func NewMiddleware(us railway.UserService) *Middleware {
	return &Middleware{us}
}

// AdminChain routes are only accessible to admins
func (mw *Middleware) AdminChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return mw.withLogging(mw.withRecover(mw.withToken(mw.withAdmin(http.HandlerFunc(h))))).ServeHTTP
}

// ClientAdminChain routes are only accessible to admins
func (mw *Middleware) ClientAdminChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return mw.withLogging(mw.withRecover(mw.withToken(mw.withClientAdmin(http.HandlerFunc(h))))).ServeHTTP
}

// SecureChain routes are only accessible to members and above
func (mw *Middleware) SecureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return mw.withLogging(mw.withRecover(mw.withToken(http.HandlerFunc(h)))).ServeHTTP
}

// InsecureChain routes are accessible to everyone
func (mw *Middleware) InsecureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return mw.withLogging(mw.withRecover(http.HandlerFunc(h))).ServeHTTP
}

func (mw *Middleware) withClientAdmin(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		cookie, err := LoadCookie(r, cookieStore)
		if err != nil {
			HandleErrorAndRespond(w, ErrorInvalidCookie, http.StatusUnauthorized)
			return
		}

		userFromDB := mw.UserService.UserByID(cookie.UserID)
		isAdmin := userFromDB.Role != railway.RoleAdmin
		isManager := userFromDB.Role != railway.RoleManager
		if !isAdmin || !isManager {
			HandleErrorAndRespond(w, ErrorAdminStatusRequired, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func (mw *Middleware) withAdmin(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		cookie, err := LoadCookie(r, cookieStore)
		if err != nil {
			HandleErrorAndRespond(w, ErrorInvalidCookie, http.StatusUnauthorized)
			return
		}

		userFromDB := mw.UserService.UserByID(cookie.UserID)

		if userFromDB.Role != railway.RoleAdmin {
			HandleErrorAndRespond(w, ErrorAdminStatusRequired, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func (mw *Middleware) withRecover(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		var err error
		defer func() {
			rec := recover()

			if rec != nil {
				switch kind := rec.(type) {
				case string:
					err = errors.New(kind)
				case error:
					err = kind
				default:
					err = errors.New("Unknown error")
				}
				log.Println("PANIC: ", err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func (mw *Middleware) withToken(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		cookie, err := LoadCookie(r, cookieStore)
		if err != nil {
			HandleErrorAndRespond(w, ErrorInvalidCookie, http.StatusUnauthorized)
			return
		}

		userFromDB := mw.UserService.UserByID(cookie.UserID)

		if userFromDB.SessionToken != cookie.SessionToken {
			HandleErrorAndRespond(w, ErrorEmailTokenMismatch, http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func (mw *Middleware) withLogging(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		log.Printf("-> [%s] %q\n", r.Method, r.URL.String())
		t1 := time.Now()
		next.ServeHTTP(w, r)
		t2 := time.Now()
		log.Printf("<- [%s] %q %v\n", r.Method, r.URL.String(), t2.Sub(t1))
	}
	return http.HandlerFunc(fn)
}
