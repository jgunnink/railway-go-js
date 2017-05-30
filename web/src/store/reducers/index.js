import { combineReducers } from "redux"
import accountUpdate from "./accountUpdate"
import authentication from "./authentication"
import notifications from "./notifications"
import signup from "./signup"
import ui from "./ui"
import users from "./users"

const railway = combineReducers({
  accountUpdate,
  authentication,
  notifications,
  signup,
  ui,
  users
})

export default railway
