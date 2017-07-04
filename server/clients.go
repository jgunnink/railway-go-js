package server

import (
	"log"
	"net/http"
	"time"

	"github.com/blockninja/ninjarouter"
	"github.com/jgunnink/railway"
)

// ClientController contains the handlers needed for Client actions
type ClientController struct {
	*ninjarouter.Mux
	ClientService railway.ClientService
	UserService   railway.UserService
}

// NewClientController creates a new instance of a ClientController
func NewClientController(mw railway.MiddlewareService, cs railway.ClientService, us railway.UserService) *ClientController {
	result := &ClientController{
		ClientService: cs,
		UserService:   us,
		Mux:           ninjarouter.New(),
	}

	result.Mux.GET("/clients/all", mw.AdminChain(result.ClientAll))
	result.Mux.GET("/clients/:id", mw.AdminChain(result.ClientByID))
	result.Mux.GET("/clients/:id/users/all", mw.AdminChain(result.UserAll))
	result.Mux.POST("/clients/:id/update", mw.AdminChain(result.ClientUpdate))
	result.Mux.POST("/clients/:id/archive", mw.AdminChain(result.ClientArchive))
	result.Mux.POST("/clients/create", mw.AdminChain(result.ClientCreate))

	return result
}

// ClientByID will return the client given an ID
// BEGIN API
// Name = "ClientByID"
// Method = "GET"
// Path = "http://localhost:8080/clients/:id"
// Description = "Gets a client based on their ID"
func (cc *ClientController) ClientByID(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "ClientByID",
		Description: "ClientByID is the handler for ClientByID",
	}
	log.Println("Run handler:", details.Handler)
	marshalAndRespond(w, cc.ClientService.ClientByID(mustGetID(r, "id")))
}

// UserAll will return all non-archived users for a client
// Method = "GET"
// Path = "http://localhost:8080/clients/:id/users/all"
// Description = "Gets all non-archived users"
func (cc *ClientController) UserAll(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "UserAll",
		Description: "UserAll is the handler for UserAll",
	}
	log.Println("Run handler:", details.Handler)

	marshalAndRespond(w, cc.UserService.UsersByClient(mustGetID(r, "id")))
}

// ClientAll will return all non-archived clients
// BEGIN API
// Name = "ClientAll"
// Method = "GET"
// Path = "http://localhost:8080/clients/all"
// Description = "Gets all non-archived clients"
func (cc *ClientController) ClientAll(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "ClientAll",
		Description: "ClientAll is the handler for ClientAll",
	}
	log.Println("Run handler:", details.Handler)
	marshalAndRespond(w, cc.ClientService.ClientAll())

}

// ClientUpdate will update the client given an ID
// BEGIN API
// Name = "ClientUpdate"
// Method = "POST"
// Path = "http://localhost:8080/client/:id/update"
// Description = "Updates a client given an ID"
func (cc *ClientController) ClientUpdate(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "ClientUpdate",
		Description: "ClientUpdate is the handler for ClientUpdate",
	}
	log.Println("Run handler:", details.Handler)

	clientID := mustGetID(r, "id")
	client := cc.ClientService.ClientByID(clientID)

	mustDecodeJSON(r, client)

	result := cc.ClientService.ClientUpdate(client)
	marshalAndRespond(w, result)
}

// ClientArchive will return the client given an ID
// BEGIN API
// Name = "ClientArchive"
// Method = "POST"
// Path = "http://localhost:8080/clients/:id/archive"
// Description = "Archives a client based on their ID"
func (cc *ClientController) ClientArchive(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "ClientArchive",
		Description: "ClientArchive is the handler for ClientArchive",
	}
	log.Println("Run handler:", details.Handler)
	marshalAndRespond(w, cc.ClientService.ClientArchive(mustGetID(r, "id")))
}

// ClientCreate will create a new client
// BEGIN API
// Name = "ClientCreate"
// Method = "POST"
// Path = "http://localhost:8080/clients/:id/create"
// Description = "Creates a new client in the system"
func (cc *ClientController) ClientCreate(w http.ResponseWriter, r *http.Request) {
	details := &funcDetails{
		Handler:     "ClientCreate",
		Description: "ClientCreate is the handler for ClientCreate",
	}
	log.Println("Run handler:", details.Handler)
	clientCreateRequest := &railway.ClientCreateRequest{}
	MustDecodeJSON(r, clientCreateRequest)

	client := &railway.Client{
		Name:        clientCreateRequest.Name,
		Description: clientCreateRequest.Description,
		Data:        clientCreateRequest.Data,
		Archived:    false,
		ArchivedOn:  nil,
		CreatedAt:   time.Now(),
	}
	resp := cc.ClientService.ClientCreate(client)
	marshalAndRespond(w, resp)
}
