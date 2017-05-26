export const RECEIVE_USERS = "RECEIVE_USERS"

export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
	list: users
  }
}
