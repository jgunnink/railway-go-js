package db

import (
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx"
	"github.com/jgunnink/railway"
	"github.com/pkg/errors"
)

// This ensures the struct satisfies the interface
var _ railway.ClientService = &ClientService{}

// ClientService contains the methods DB has for Clients
type ClientService struct {
	db *pgx.ConnPool
}

const clientAllColumns = `
		id,
		name,
		description,
		data,
		archived,
		archived_on,
		created_at
`

// ClientCreate saves a new CLIENT to the database given a CLIENT
func (cs *ClientService) ClientCreate(client *railway.Client) (*railway.Client, error) {
	details := &MethodInfo{
		Name:        "ClientCreate",
		Description: "ClientCreate is the DB method used to ClientCreate",
	}
	newClient := &railway.Client{}
	query := fmt.Sprintf(`
	INSERT INTO clients (name, description, data, archived_on)
	VALUES ($1, $2, $3, NULL)
	RETURNING %s
`, clientAllColumns)
	err := cs.db.QueryRow(query,
		client.Name,
		client.Description,
		client.Data,
	).Scan(newClient.Scan()...)
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	return newClient, nil
}

// ClientAll returns all active clients which are unarchived
func (cs *ClientService) ClientAll() (map[int]*railway.Client, error) {
	details := &MethodInfo{
		Name:        "ClientAll",
		Description: "ClientAll is the DB method used to ClientAll",
	}
	query := fmt.Sprintf(`
		SELECT %s
		FROM clients 
		WHERE archived=false
`, clientAllColumns)
	rows, err := cs.db.Query(query)
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}
	result := map[int]*railway.Client{}
	for rows.Next() {
		tempClient := &railway.Client{}
		rows.Scan(tempClient.Scan()...)
		result[tempClient.ID] = tempClient
	}
	rows.Close()

	return result, nil
}

// ClientArchive will archive a client.
func (cs *ClientService) ClientArchive(id int) (*railway.Client, error) {
	details := &MethodInfo{
		Name:        "ClientArchive",
		Description: "ClientArchive is the DB method used to ClientArchive",
	}
	tx, err := cs.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	query := fmt.Sprintf(`
	UPDATE clients SET archived=true, archived_on=$1 WHERE id=$2 
	RETURNING %s
`, clientAllColumns)
	archivedClient := &railway.Client{}
	err = tx.QueryRow(query, time.Now().UTC().Format(time.RFC3339), id).Scan(archivedClient.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()
	return archivedClient, nil
}

// ClientByID returns a single Client given an ID
func (cs *ClientService) ClientByID(ID int) (*railway.Client, error) {
	details := &MethodInfo{
		Name:        "ClientByID",
		Description: "ClientByID is the DB method used to find a ClientByID",
	}
	client := &railway.Client{}
	query := fmt.Sprintf(`
		SELECT %s
		FROM users
		WHERE id=$1
`, clientAllColumns)
	err := cs.db.QueryRow(query, ID).Scan(client.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	return client, nil
}

// ClientUpdate updates an existing client account to the database.
func (cs *ClientService) ClientUpdate(client *railway.Client) (*railway.Client, error) {
	details := &MethodInfo{
		Name:        "ClientUpdate",
		Description: "ClientUpdate is the DB method used to ClientUpdate",
	}
	tx, err := cs.db.Begin()
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}
	query := fmt.Sprintf(`
	UPDATE clients 
	SET name=$1, 
		description=$2, 
		data=$3
	WHERE id=$4
	RETURNING %s
`, clientAllColumns)

	updatedClient := &railway.Client{}

	err = tx.QueryRow(query, client.Name, client.Description, client.Data, client.ID).Scan(updatedClient.Scan())
	if err != nil {
		return nil, errors.Wrap(err, details.Name)
	}

	tx.Commit()
	log.Println("Client updated:", client.Name)
	return updatedClient, nil
}
