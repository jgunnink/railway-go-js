package client

import (
	"bytes"
	"encoding/json"

	"github.com/jgunnink/railway"
)

// ClientCreate will create a new client
func (c *Client) ClientCreate(data *railway.ClientCreateRequest) error {
	payload, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return c.postHelper("/clients/create", bytes.NewReader(payload))
}

// ClientAll will fetch all clients
func (c *Client) ClientAll() (map[int]*railway.Client, error) {
	result := map[int]*railway.Client{}
	err := c.getHelper("/clients/all", &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
