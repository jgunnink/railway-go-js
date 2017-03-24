package server

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/jgunnink/railway/db"
)

func withRecover(next http.Handler) http.Handler {
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

func withToken(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		details := &funcDetails{
			Name:        "secureMiddleware",
			Description: "Checks if a user is logged in before starting the next handler",
		}
		session, err := cookieStore.Get(r, "_railway_session")
		if err != nil {
			handleErrorAndRespond(details, w, err.Error(), http.StatusInternalServerError)
			return
		}

		emailIface, ok := session.Values["email"]
		log.Println(session)
		if !ok {
			handleErrorAndRespond(details, w, "email not in session", http.StatusForbidden)
			return
		}
		email := emailIface.(string)

		sessionIface, ok := session.Values["session_token"]
		if !ok {
			handleErrorAndRespond(details, w, "session_token not in session", http.StatusForbidden)
			return
		}
		sessionToken := sessionIface.(string)

		dbclient := db.Client()
		userFromDB, err := dbclient.UserByEmail(email)
		if err != nil {
			handleErrorAndRespond(details, w, "Email token mismatch", http.StatusForbidden)
			return
		}

		if userFromDB.SessionToken != sessionToken {
			handleErrorAndRespond(details, w, "Session tokens do not match", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func withLogging(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		log.Printf("-> [%s] %q\n", r.Method, r.URL.String())
		t1 := time.Now()
		next.ServeHTTP(w, r)
		t2 := time.Now()
		log.Printf("<- [%s] %q %v\n", r.Method, r.URL.String(), t2.Sub(t1))
	}
	return http.HandlerFunc(fn)
}
