export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export function addNotification(message, level) {
	return {
		type: ADD_NOTIFICATION,
		message,
		level
	}
}

export function clearNotification(message, level) {
	return {
		type: CLEAR_NOTIFICATION
	}
}
