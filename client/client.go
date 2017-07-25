package client

import (
	"net/http"
	"net/http/cookiejar"

	"github.com/jgunnink/railway"
)

// This ensures the struct satisfies the interface
var _ railway.HTTPService = &Client{}

// Client contains the HTTP client for railway
type Client struct {
	BaseURL string
	client  *http.Client
}

// New will return a new client
func New(baseURL string) *Client {
	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}
	c := &http.Client{Jar: jar}
	return &Client{
		client:  c,
		BaseURL: baseURL,
	}
}
