import Immutable from "immutable"
import { SIGNUP_SUCCESS, SIGNUP_FAILURE } from "../actions/signup"

const initialState = Immutable.fromJS({
  success: undefined,
	status: undefined
})

function signup(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_FAILURE:
      return state.merge(action)
    case SIGNUP_SUCCESS:
      return state.merge(action)
    default:
      return state
  }
}

export default signup
