import { CHANGE_ACTIVE_SCREEN } from '../actions/ui'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  activeScreen: 'home'
})

const uiReducer = (state = initialState, action) => {
  switch(action.type) {
    case CHANGE_ACTIVE_SCREEN:
      return state.merge(action)
    default:
    return state
  }
}

export default uiReducer