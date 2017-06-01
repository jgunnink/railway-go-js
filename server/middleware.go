package server

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/jgunnink/railway/db"
	"github.com/jgunnink/railway/httperrors"
)

func withAdmin(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		session, err := cookieStore.Get(r, "_railway_session")
		email, ok := session.Values["email"].(string)
		if !ok {
			httperrors.HandleErrorAndRespond(w, httperrors.IDNotInSession, http.StatusUnauthorized)
			return
		}

		dbclient := db.Client()
		userFromDB, err := dbclient.UserByEmail(email)
		if err != nil {
			httperrors.HandleErrorAndRespond(w, httperrors.EmailTokenMismatch, http.StatusUnauthorized)
			return
		}

		if userFromDB.Role != "admin" {
			httperrors.HandleErrorAndRespond(w, httperrors.AdminStatusRequired, http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

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
		session, err := cookieStore.Get(r, "_railway_session")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		emailIface, ok := session.Values["email"]
		if !ok {
			httperrors.HandleErrorAndRespond(w, httperrors.EmailNotInSession, http.StatusUnauthorized)
			return
		}
		email := emailIface.(string)

		sessionIface, ok := session.Values["session_token"]
		if !ok {
			httperrors.HandleErrorAndRespond(w, httperrors.SessionTokenNotInSession, http.StatusUnauthorized)
			return
		}
		sessionToken := sessionIface.(string)

		dbclient := db.Client()
		userFromDB, err := dbclient.UserByEmail(email)
		if err != nil {
			httperrors.HandleErrorAndRespond(w, httperrors.EmailTokenMismatch, http.StatusUnauthorized)
			return
		}

		if userFromDB.SessionToken != sessionToken {
			httperrors.HandleErrorAndRespond(w, httperrors.EmailTokenMismatch, http.StatusUnauthorized)
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
