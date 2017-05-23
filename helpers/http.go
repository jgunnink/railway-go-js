package helpers

import (
	"encoding/json"
	"net/http"
)

// MustDecodeJSON receives a pointer to struct, and updates the struct values
// with the values from the JSON in the http request
func MustDecodeJSON(r *http.Request, target interface{}) {
	err := json.NewDecoder(r.Body).Decode(target)
	if err != nil {
		panic(err)
	}
}

// Error is a struct with which we can marshal into JSON for a HTTP response
type Error struct {
	Message string
}

// ErrorJSON returns a string for use in http.Error
func ErrorJSON(err error) string {
	errResponse := &Error{Message: err.Error()}
	result, err := json.Marshal(errResponse)
	if err != nil {
		panic(err)
	}
	return string(result)
}
