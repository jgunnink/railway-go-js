export const CHANGE_ACTIVE_SCREEN = 'CHANGE_ACTIVE_SCREEN'

export const changeActiveScreen = (screen) => {
  return {
    type: CHANGE_ACTIVE_SCREEN,
    activeScreen: screen
  }
}
