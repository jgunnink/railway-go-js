import React from "react"
import { Menu, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "./custom.css"

const NavigationBar = (props) => {
  const changeActiveScreen = props.changeActiveScreen
  const activeScreen = props.activeScreen
  const isAuthenticated = props.isAuthenticated
  const logout = props.logout

  return (
    <Segment inverted>
      <Menu inverted pointing secondary>
        <Menu.Item name="home" active={activeScreen === "home"}><Link href="/" onClick={()=>{changeActiveScreen("home")}}>Home</Link></Menu.Item>
        <Menu.Item name="signup" active={activeScreen === "signup"}><Link href="/signup" onClick={()=>{changeActiveScreen("signup")}}>Signup</Link></Menu.Item>
        <Menu.Menu position="right">
          { isAuthenticated && <Menu.Item name="Logout"><Link href="/logout" onClick={()=>{changeActiveScreen("home"); logout()}}>Logout</Link></Menu.Item> }
          { !isAuthenticated && <Menu.Item name="Login" active={activeScreen === "login"}><Link href="/login" onClick={()=>{changeActiveScreen("login")}}>Login</Link></Menu.Item> }
        </Menu.Menu>
      </Menu>
    </Segment>
  )
}

export default NavigationBar
