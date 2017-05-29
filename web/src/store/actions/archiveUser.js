import request from "../../util/agent"

import { push } from "redux-little-router"

export function archiveUser(userID) {
  return dispatch => {
    request.post("/archive/" + userID)
      .then((res) => {
        dispatch(push("/admin/usermanagement"))
      })
  }
}

export default archiveUser
