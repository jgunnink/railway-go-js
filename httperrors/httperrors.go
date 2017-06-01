package httperrors

import (
	"encoding/json"
	"log"
	"net/http"
)

type funcDetails interface {
	Name() string
	Description() string
}

type ServerError map[int]string
type ErrorCode struct {
	Code int
	Desc string
}

var (
	// StatusPasswordMismatch will result from a mismatch of passwords
	StatusPasswordMismatch = &ErrorCode{
		Code: 4011,
		Desc: "Password mismatch",
	}
	// IDNotInSession indicates the users id does not have an active session
	IDNotInSession = &ErrorCode{
		Code: 4012,
		Desc: "ID not in session",
	}
	// EmailNotInSession indicates the users id does not have an active session
	EmailNotInSession = &ErrorCode{
		Code: 4013,
		Desc: "Email not in session",
	}
	// EmailTokenMismatch indicates the users email doesn't match the token provided
	EmailTokenMismatch = &ErrorCode{
		Code: 4014,
		Desc: "Email token mismatch",
	}
	// SessionTokenNotInSession indicates the provided token doesn't match the any active session
	SessionTokenNotInSession = &ErrorCode{
		Code: 4015,
		Desc: "Session token not in session",
	}
	// AdminStatusRequired indicates is used when the action is for admin users
	AdminStatusRequired = &ErrorCode{
		Code: 4031,
		Desc: "Admin status required",
	}
)

// HandleErrorAndRespond responds with an error response struct in JSON
func HandleErrorAndRespond(w http.ResponseWriter, err *ErrorCode, statusCode int) {
	log.Println("handler error:", err.Desc)
	w.WriteHeader(statusCode)
	response := &ErrorResponse{
		StatusCode:   statusCode,
		ErrorMessage: err.Desc,
		ErrorCode:    err.Code,
	}
	json.NewEncoder(w).Encode(response)
}

// ErrorResponse contains the response to the client on error
type ErrorResponse struct {
	StatusCode   int    `json:"status_code"`
	ErrorCode    int    `json:"error_code"`
	ErrorMessage string `json:"error_message"`
	HandlerName  string `json:"handler_name"`
	HandlerDesc  string `json:"handler_description"`
}
