import React from "react"
import { Button, Header } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/landing_page.css"

const Welcome = (props) => {
  const changeActiveScreen = props.changeActiveScreen
  
  return (
    <div className="vertical-center">
      <Header color="orange" as="h1">
        <Header.Content>
          Railway
        </Header.Content>
      </Header>
      <div>
        <Link href="/signup">
          <Button content="Sign Up" icon="pencil" labelPosition="left" onClick={()=>{changeActiveScreen("signup")}}/>
        </Link>
        <Link href="/login">
          <Button color="orange" content="Log in" icon="right arrow" labelPosition="right" onClick={()=>{changeActiveScreen("login")}}/>
        </Link>
      </div>
    </div>
  )
}

export default Welcome
