package server

import (
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"github.com/vulcand/oxy/forward"
	"github.com/vulcand/oxy/testutils"
)

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

// Run starts the server and serves the react application
func Run() {
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
