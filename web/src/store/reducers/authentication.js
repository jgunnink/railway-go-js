import immutable, {Map} from "immutable"
import { 
	LOGIN_REQUEST, 
	LOGIN_SUCCESS, 
	LOGIN_FAILURE, 
	LOGOUT_SUCCESS,
	UNAUTHORISED
	} from "../actions/authentication"

function auth(
  state = immutable.fromJS({
    isFetching: false, 
    isAuthenticated: localStorage.getItem("id_token") ? true : false,
    status: undefined
  }), action) 
{ 
  switch (action.type) {
    case LOGIN_REQUEST:
      return Map({
        isFetching: true,
        isAuthenticated: false,
        email: action.creds.email
      })
    case LOGIN_SUCCESS:
      return state.merge(action)
    case LOGIN_FAILURE:
      return Map({
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    case LOGOUT_SUCCESS:
      return Map({
        isFetching: false,
        isAuthenticated: false
      })
	case UNAUTHORISED:
      return state.merge(action)
    default:
      return state
  }
}

export default auth
