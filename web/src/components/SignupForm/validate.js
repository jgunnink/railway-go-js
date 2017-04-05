import isEmail from "../../helpers/isEmail"

const validate = values => {
  let errors = {}
  let password = values.get("password") || ""
  let email = values.get("email") || ""

  if (email === "") { // Testing the email is not empty.
    errors.email = "Email address is required. "
  } else if (!isEmail(email)) { // Checks the email is valid using regex.
    errors.email = "Must be a valid email address. "
  }
  if (password.length < 8) { // Ensures password is at least 8 characters.
    errors.password = "Please use at least 8 characters"
  }

  return errors
}

export default validate
