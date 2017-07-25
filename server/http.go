package server

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/sessions"
	"github.com/jgunnink/railway"
	"github.com/vulcand/oxy/forward"
	"github.com/vulcand/oxy/testutils"
)

var cookieStore = sessions.NewCookieStore([]byte("gelatinoid-reparable-salmon"))

const cookieName = "_railway_session"

type funcDetails struct {
	Handler     string
	Description string
}

// Server is the container for the server instance
type Server struct {
	*http.Server
}

// New returns a new instance of the Server
func New(port string, as railway.AuthService, cs railway.ClientService, us railway.UserService) *Server {
	mw := NewMiddleware(us)
	ac := NewAuthController(mw, as, us)
	cc := NewClientController(mw, cs, us)
	uc := NewUserController(mw, us)
	masterHandler := NewMasterHandler(ac, cc, uc)

	s := &http.Server{
		Addr:    port,
		Handler: masterHandler,
	}
	return &Server{
		Server: s,
	}
}

// Run will begin the server
func (s *Server) Run() error {
	return s.ListenAndServe()
}

// Shutdown will gracefully shutdown the Server
func (s *Server) Shutdown() error {
	return s.Shutdown()
}

// MasterHandler is a collection of all the service Handlers.
type MasterHandler struct {
	AuthController   *AuthController
	ClientController *ClientController
	UserController   *UserController
	ProxyHandler     func(http.ResponseWriter, *http.Request)
	FileServer       *http.ServeMux
}

// ReverseProxy provides the react app on port 3000 to go.
func ReverseProxy(w http.ResponseWriter, r *http.Request) {
	r.URL = testutils.ParseURI("http://localhost:3000")
	logrus.SetLevel(logrus.FatalLevel)
	fwd, err := forward.New(forward.Stream(false))
	if err != nil {
		panic(err)
	}
	fwd.ServeHTTP(w, r)
}

// NewMasterHandler returns the top level handler
func NewMasterHandler(ac *AuthController, cc *ClientController, uc *UserController) *MasterHandler {
	log.Println("Run fileserver")
	fileshttp := http.NewServeMux()
	fileshttp.Handle("/", http.FileServer(http.Dir("./web/public/")))

	return &MasterHandler{
		AuthController:   ac,
		ClientController: cc,
		UserController:   uc,
		ProxyHandler:     ReverseProxy,
		FileServer:       fileshttp,
	}
}

// ServeHTTP delegates a request to the appropriate subhandler.
func (h *MasterHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.Header.Get("X-API") != "":
		h.HandleAPI(w, r)
	case strings.HasPrefix(r.URL.Path, "/Cesium"):
		h.FileServer.ServeHTTP(w, r)
	case strings.HasPrefix(r.URL.Path, "/3dmodels"):
		h.FileServer.ServeHTTP(w, r)
	default:
		h.HandleReactProxy(w, r)
	}
}

// HandleAPI will handle all API calls
func (h *MasterHandler) HandleAPI(w http.ResponseWriter, r *http.Request) {
	log.Println("Run API server")
	switch {
	case strings.HasPrefix(r.URL.Path, "/users"):
		log.Println("Run UserController")
		h.UserController.ServeHTTP(w, r)
	case strings.HasPrefix(r.URL.Path, "/clients"):
		log.Println("Run ClientController")
		h.ClientController.ServeHTTP(w, r)
	case strings.HasPrefix(r.URL.Path, "/auth"):
		log.Println("Run AuthController")
		h.AuthController.ServeHTTP(w, r)
	default:
		http.NotFound(w, r)
	}
}

// HandleReactProxy will serve the react app
func (h *MasterHandler) HandleReactProxy(w http.ResponseWriter, r *http.Request) {
	log.Println("Run react proxy")
	if os.Getenv("PROD") == "" {
		log.Println(r.Method, r.URL.Path)
		h.ProxyHandler(w, r)
	} else {
		log.Println(r.Method, r.URL.Path)
		h.FileServer.ServeHTTP(w, r)
	}
}
