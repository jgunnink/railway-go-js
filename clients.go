package railway

import (
	"time"
)

// Client contains the columns for the clients of the web application.
type Client struct {
	ID          int         `json:"id" db:"id"`
	Name        string      `json:"name" db:"name"`
	Description string      `json:"description" db:"description"`
	Data        *ClientData `json:"data" db:"data"`
	Archived    bool        `json:"archived" db:"archived"`
	ArchivedOn  *time.Time  `json:"archived_on" db:"archived_on"`
	CreatedAt   time.Time   `json:"created_at" db:"created_at"`
}

// Scan will return the fields for pgx to scan into
func (c *Client) Scan() []interface{} {
	return []interface{}{
		&c.ID,
		&c.Name,
		&c.Description,
		&c.Data,
		&c.Archived,
		&c.ArchivedOn,
		&c.CreatedAt,
	}
}

// ClientData is the JSON data for Clients
type ClientData struct {
	Avatar string `json:"avatar" db:"avatar"`
}

// ClientCreateRequest contains a request for the creation of a client
type ClientCreateRequest struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Data        *ClientData `json:"data"`
}

// ClientUpdateRequest contains a request for updating a client
type ClientUpdateRequest struct {
	Name        string      `json:"name"`
	Description string      `json:"description" db:"description"`
	Data        *ClientData `json:"data"`
}

// ClientService contains the collection of methods available from the DB
type ClientService interface {
	ClientAll() (map[int]*Client, error)
	ClientArchive(id int) (*Client, error)
	ClientCreate(client *Client) (*Client, error)
	ClientUpdate(client *Client) (*Client, error)
	ClientByID(id int) (*Client, error)
}
