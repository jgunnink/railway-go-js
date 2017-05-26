import { combineReducers } from "redux"
import accountUpdate from "./accountUpdate"
import authentication from "./authentication"
import signup from "./signup"
import ui from "./ui"
import users from "./users"

const railway = combineReducers({
  accountUpdate,
  authentication,
  signup,
  ui,
  users
})

export default railway
