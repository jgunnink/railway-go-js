package db

import (
	"log"
	"time"

	"github.com/jgunnink/railway"

	"github.com/jmoiron/sqlx"
)

// This ensures the struct satisfies the interface
var _ railway.ClientService = &ClientService{}

// ClientService contains the methods DB has for Clients
type ClientService struct {
	db *sqlx.DB
}

// ClientCreate saves a new CLIENT to the database given a CLIENT
func (cs *ClientService) ClientCreate(client *railway.Client) *railway.Client {

	dest := &railway.Client{}
	query := `
INSERT INTO clients (name, description, data, archived_on)
VALUES ($1, $2, $3, NULL)
RETURNING *
`

	mustGet(cs.db, dest, query, client.Name, client.Description, client.Data)

	log.Println("New client created:", client.Name)
	return cs.ClientByID(dest.ID)
}

// ClientAll returns all active clients which are unarchived
func (cs *ClientService) ClientAll() map[int]*railway.Client {
	clients := []*railway.Client{}
	err := cs.db.Select(&clients, "SELECT * FROM clients WHERE archived=false")
	if err != nil {
		panic(err)
	}
	result := map[int]*railway.Client{}
	for _, client := range clients {
		result[client.ID] = client
	}
	return result
}

// ClientArchive will archive a client.
func (cs *ClientService) ClientArchive(id int) *railway.Client {
	archivedClient := &railway.Client{}
	err := cs.db.Get(archivedClient, "UPDATE clients SET archived=true, archived_on=$1 WHERE id=$2 RETURNING *", time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		panic(err)
	}

	return archivedClient
}

// ClientByID returns a single Client given an ID
func (cs *ClientService) ClientByID(ID int) *railway.Client {
	client := &railway.Client{}
	err := cs.db.Get(client, "SELECT * FROM clients WHERE ID=$1", ID)
	if err != nil {
		panic(err)
	}

	return client
}

// ClientUpdate updates an existing client account to the database.
func (cs *ClientService) ClientUpdate(client *railway.Client) *railway.Client {
	query := `
	UPDATE clients 
	SET name=$1, description=$2, data=$3
	WHERE id=$4
	RETURNING id
`
	var id int
	mustGet(cs.db, &id, query, client.Name, client.Description, client.Data, client.ID)

	log.Println("Client updated:", client.Name)
	return cs.ClientByID(id)
}

func mustGet(q sqlx.Queryer, dest interface{}, query string, args ...interface{}) {
	err := sqlx.Get(q, dest, query, args...)
	if err != nil {
		panic(err)
	}
}

func mustSelect(q sqlx.Queryer, dest interface{}, query string, args ...interface{}) {
	err := sqlx.Select(q, dest, query, args...)
	if err != nil {
		panic(err)
	}
}
