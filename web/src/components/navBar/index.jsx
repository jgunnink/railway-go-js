import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import './custom.css'

const NavigationBar = (props) => {
  const changeActiveScreen = props.changeActiveScreen
  const activeScreen = props.activeScreen

  return (
    <Segment inverted>
      <Menu inverted pointing secondary style={{}}>
        <Menu.Item name='home' active={activeScreen === 'home'}></Menu.Item>
        <Menu.Item name='signup' active={activeScreen === 'signup'}></Menu.Item>
      </Menu>
    </Segment>
  )
}

export default NavigationBar