import { combineReducers } from "redux"
import authentication from "./authentication"
import ui from "./ui"
import signup from "./signup"

const railway = combineReducers({
  ui,
  signup,
  authentication
})

export default railway
