package helpers

import (
	"crypto/rand"
	"encoding/base64"
)

// NewSessionToken creates exactly that.
func NewSessionToken() string {
	sessionTokenBytes := make([]byte, 32)
	rand.Read(sessionTokenBytes)
	return base64.StdEncoding.EncodeToString(sessionTokenBytes)
}
