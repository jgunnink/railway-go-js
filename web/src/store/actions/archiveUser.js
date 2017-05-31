import request from "../../util/agent"
import { addNotification } from "./notifications"

import { push } from "redux-little-router"

export function archiveUser(userID) {
  return dispatch => {
    request.post("/archive/" + userID)
      .then((res) => {
        dispatch(push("/admin/usermanagement"))
		dispatch(addNotification("User has been successfully archived.", "info"))
      })
  }
}

export default archiveUser
