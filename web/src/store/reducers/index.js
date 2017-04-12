import { combineReducers } from "redux"
import accountUpdate from "./accountUpdate"
import authentication from "./authentication"
import ui from "./ui"
import signup from "./signup"

const railway = combineReducers({
  accountUpdate,
  authentication,
  signup,
  ui
})

export default railway
