package client

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

func (c *Client) postHelper(url string, payload io.Reader) error {
	req, err := http.NewRequest("POST", c.BaseURL+url, payload)
	if err != nil {
		return err
	}
	req.Header.Set("X-API", "V1")
	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return errors.New(resp.Status)
	}
	return nil
}

func (c *Client) getHelper(url string, target interface{}) error {
	req, err := http.NewRequest("GET", c.BaseURL+url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("X-API", "V1")
	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	json.NewDecoder(resp.Body).Decode(target)
	return nil
}
