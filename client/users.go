package client

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/jgunnink/railway"
)

// UserByID will get a user from an ID
func (c *Client) UserByID(id int) (*railway.User, error) {
	resp, err := http.Get(c.BaseURL + "/users/" + strconv.Itoa(id) + "/get")
	if err != nil {
		return nil, err
	}
	result := &railway.User{}
	json.NewDecoder(resp.Body).Decode(result)
	return result, nil
}

// UserCreate will create a new user
func (c *Client) UserCreate(data *railway.UserCreateRequest) error {
	payload, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return c.postHelper("/users/create", bytes.NewReader(payload))
}
