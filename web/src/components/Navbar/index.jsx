import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from 'redux-little-router'
import './custom.css'

const NavigationBar = (props) => {
  const changeActiveScreen = props.changeActiveScreen
  const activeScreen = props.activeScreen

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item name='home' active={activeScreen === 'home'}><Link href='/' onClick={()=>{changeActiveScreen("home")}}>Home</Link></Menu.Item>
        <Menu.Item name='signup' active={activeScreen === 'signup'}><Link href='/signup' onClick={()=>{changeActiveScreen("signup")}}>Signup</Link></Menu.Item>
      </Menu>
    </Segment>
  )
}

export default NavigationBar