package server

import (
	"encoding/json"
	"log"
	"net/http"
)

// ErrorCode contains the code and description of the custom error
type ErrorCode struct {
	Code int
	Desc string
}

var (
	// ErrorDuplicateEmail will result from a mismatch of passwords
	ErrorDuplicateEmail = &ErrorCode{
		Code: 4001,
		Desc: "That email already exists in the system",
	}
	// ErrorPasswordMismatch will result from a mismatch of passwords
	ErrorPasswordMismatch = &ErrorCode{
		Code: 4011,
		Desc: "Password mismatch",
	}
	// ErrorIDNotInSession indicates the users id does not have an active session
	ErrorIDNotInSession = &ErrorCode{
		Code: 4012,
		Desc: "ID not in session",
	}
	// ErrorEmailNotInSession indicates the users id does not have an active session
	ErrorEmailNotInSession = &ErrorCode{
		Code: 4013,
		Desc: "Email not in session",
	}
	// ErrorEmailTokenMismatch indicates the users email doesn't match the token provided
	ErrorEmailTokenMismatch = &ErrorCode{
		Code: 4014,
		Desc: "Email token mismatch",
	}
	// ErrorSessionTokenNotInSession indicates the provided token doesn't match the any active session
	ErrorSessionTokenNotInSession = &ErrorCode{
		Code: 4015,
		Desc: "Session token not in session",
	}
	// ErrorInvalidCookie indicates the provided cookie is invalid
	ErrorInvalidCookie = &ErrorCode{
		Code: 4016,
		Desc: "Invalid cookie provided",
	}
	// ErrorUserNotFound indicates the user was not found in the database when looked up.
	ErrorUserNotFound = &ErrorCode{
		Code: 4017,
		Desc: "User could not found",
	}
	// ErrorAccountDisabled indicates the user's account has been disabled.
	ErrorAccountDisabled = &ErrorCode{
		Code: 4017,
		Desc: "Account disabled",
	}
	// ErrorAdminStatusRequired indicates is used when the action is for admin users
	ErrorAdminStatusRequired = &ErrorCode{
		Code: 4031,
		Desc: "Admin status required",
	}
	// ErrorClientAdminStatusRequired indicates is used when the action is for admin users
	ErrorClientAdminStatusRequired = &ErrorCode{
		Code: 4032,
		Desc: "Client Admin status required",
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
}
