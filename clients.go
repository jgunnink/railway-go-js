package railway

import (
	"time"

	"github.com/jmoiron/sqlx/types"
)

// Client contains the columns for the clients of the web application.
type Client struct {
	ID          int            `json:"id" db:"id"`
	Name        string         `json:"name" db:"name"`
	Description string         `json:"description" db:"description"`
	Data        types.JSONText `json:"data" db:"data"`
	Archived    bool           `json:"archived" db:"archived"`
	ArchivedOn  *time.Time     `json:"archived_on" db:"archived_on"`
	CreatedAt   time.Time      `json:"created_at" db:"created_at"`
}

// ClientCreateRequest contains a request for the creation of a client
type ClientCreateRequest struct {
	Name        string         `json:"name" db:"name"`
	Description string         `json:"description" db:"description"`
	Data        types.JSONText `json:"data" db:"data"`
}

// ClientUpdateRequest contains a request for updating a client
type ClientUpdateRequest struct {
	Name        string         `json:"name" db:"name"`
	Description string         `json:"description" db:"description"`
	Data        types.JSONText `json:"data" db:"data"`
}

// ClientService contains the collection of methods available from the DB
type ClientService interface {
	ClientAll() map[int]*Client
	ClientArchive(id int) *Client
	ClientCreate(client *Client) *Client
	ClientUpdate(client *Client) *Client
	ClientByID(id int) *Client
}
