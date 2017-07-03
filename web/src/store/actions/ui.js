export const SCREEN_RESIZE = 'UI:SCREEN_RESIZE'
export const SCREEN_ACTIVATE = 'UI:SCREEN_ACTIVATE'

export const screenResize = (width, height) => {
	return {
		type: SCREEN_RESIZE,
		screenWidth: width,
		screenHeight: height
	}
}

export const setActiveScreen = (key) => {
	return {
		type: SCREEN_ACTIVATE,
		activeScreen: key
	}
}

