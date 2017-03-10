import { combineReducers } from 'redux'
import ui from './ui'
import signup from './signup'

const railway = combineReducers({
  ui,
  signup
})

export default railway
