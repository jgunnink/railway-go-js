import isEmail from "../../helpers/isEmail"

const validateEmail = values => {
	let errors = {}
	let email = values.get("email") || ""

	if (email === "") { // Testing the email is not empty.
		errors.email = "Email address is required. "
	} else if (!isEmail(email)) { // Checks the email is valid using regex.
		errors.email = "Must be a valid email address. "
	}

	return errors
}

export default validateEmail
