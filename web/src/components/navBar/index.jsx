import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NavigationBar = (props) => {
  const changeActiveScreen = props.changeActiveScreen
  const activeScreen = props.activeScreen

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item name='home'  active={activeScreen === 'home'}><Link to='/' onClick={()=>{changeActiveScreen("home")}}>Home</Link></Menu.Item>
        <Menu.Item name='signup'  active={activeScreen === 'signup'}><Link to='/signup' onClick={()=>{changeActiveScreen("signup")}}>Signup</Link></Menu.Item>
      </Menu>
    </Segment>
  )
}

export default NavigationBar