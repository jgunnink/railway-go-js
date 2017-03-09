import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import ui from './ui'

const railway = combineReducers({
  ui,
  form: formReducer
})

export default railway