package server

import (
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"github.com/vulcand/oxy/forward"
	"github.com/vulcand/oxy/testutils"
)

var cookieStore = sessions.NewCookieStore([]byte("gelatinoid-repairable-salmon"))

type funcDetails struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Handler is a collection of all the service handlers.
type Handler struct {
	APIHandler   *httprouter.Router
	ProxyHandler func(http.ResponseWriter, *http.Request)
	FileServer   *http.ServeMux
}

// ReverseProxy provides the react app on port 3000 to go.
func ReverseProxy(w http.ResponseWriter, r *http.Request) {
	r.URL = testutils.ParseURI("http://localhost:3000")
	fwd, err := forward.New()
	if err != nil {
		panic(err)
	}
	fwd.ServeHTTP(w, r)
}

func secureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return withLogging(withRecover(withToken(http.HandlerFunc(h)))).ServeHTTP
}

func insecureChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return withLogging(withRecover(http.HandlerFunc(h))).ServeHTTP
}

// Run starts the server and serves the react application
func Run() {
	fileshttp := http.NewServeMux()
	fileshttp.Handle("/", http.FileServer(http.Dir("./web/public/")))

	rtr := httprouter.New()

	rtr.HandlerFunc("POST", "/register", Register)
	rtr.HandlerFunc("POST", "/myaccount", secureChain(UserUpdate))
	rtr.HandlerFunc("POST", "/auth", Auth)
	rtr.HandlerFunc("DELETE", "/logout", secureChain(Logout))
	rtr.HandlerFunc("GET", "/check_login", CheckLogin)
	handler := &Handler{
		APIHandler:   rtr,
		ProxyHandler: ReverseProxy,
		FileServer:   fileshttp,
	}
	c := cors.Default().Handler(handler)
	http.ListenAndServe(":8000", c)
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
