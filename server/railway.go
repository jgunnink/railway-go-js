package server

import (
	"net/http"
	"os"

	"github.com/blockninja/ninjarouter"
	"github.com/gorilla/sessions"
	"github.com/rs/cors"
	"github.com/vulcand/oxy/forward"
	"github.com/vulcand/oxy/testutils"
)

var cookieStore = sessions.NewCookieStore([]byte("gelatinoid-repairable-salmon"))

// FuncDetails is a struct containing a name and a description
type FuncDetails struct {
	name        string
	description string
}

// Name returns a name
func (fd *FuncDetails) Name() string {
	return fd.name
}

// Description returns a description
func (fd *FuncDetails) Description() string {
	return fd.description
}

// Handler is a collection of all the service handlers.
type Handler struct {
	APIHandler   *ninjarouter.Mux
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

func adminChain(h http.HandlerFunc) func(http.ResponseWriter, *http.Request) {
	return withLogging(withRecover(withToken(withAdmin(http.HandlerFunc(h))))).ServeHTTP
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

	rtr := ninjarouter.New()

	rtr.DELETE("/logout", secureChain(Logout))
	rtr.POST("/register", insecureChain(Register))
	rtr.POST("/myaccount", secureChain(UserUpdate))
	rtr.POST("/auth", insecureChain(Auth))
	rtr.GET("/check_login", insecureChain(CheckLogin))
	rtr.POST("/member/create", secureChain(Register))
	rtr.GET("/admin/users", adminChain(UserAll))
	rtr.POST("/archive/:id", adminChain(UserArchive))

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
