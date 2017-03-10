import isEmail from "../../helpers/isEmail"

const validate = values => {
  let errors = {}
  let password = values.get("password") || ""
  let email = values.get("email") || ""

  if (email === "") {
    errors.email = "Email address is required. "
  } else if (!isEmail(email)) {
    errors.email = "Must be a valid email address. "
  }
  if (password.length < 8) {
    errors.password = "Please use at least 8 characters"
  }

  return errors
}

export default validate