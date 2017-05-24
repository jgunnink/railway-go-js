import React from "react"
import { Button, Header } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/landing_page.css"

const Welcome = (props) => {
	const changeActiveScreen = props.changeActiveScreen
	const isAuthenticated = props.isAuthenticated
  
	return (
		<div className="vertical-center jumbotron">
			<Header style={{color:"white"}} as="h1" content="Railway"/>
			{ !isAuthenticated && <div>
			<Link href="/signup">
				<Button content="Sign Up" icon="pencil" labelPosition="left" onClick={()=>{changeActiveScreen("signup")}}/>
			</Link>
			<Link href="/login">
				<Button color="orange" content="Log in" icon="right arrow" labelPosition="right" onClick={()=>{changeActiveScreen("login")}}/>
			</Link>
			</div> }
			{ isAuthenticated && <div>
				<p style={{color:"white"}}>You're signed in!</p>
				<Link href="/dashboard">
					<Button color="orange" content="Go to dashboard" icon="right arrow" labelPosition="right" onClick={()=>{changeActiveScreen("dashboard")}}/>
				</Link>
			</div> }
		</div>
	)
}

export default Welcome
