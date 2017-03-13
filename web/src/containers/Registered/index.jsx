import React from "react"
import { connect } from "react-redux"
import { Button, Container, Header, Message } from "semantic-ui-react"
import { Link } from "redux-little-router"

const Registered = (props) => {  
  return (
		<div>
			<Container><Message positive header="Registration Successful" content="Successfully created a new account." /></Container>
			<div className="vertical-center">
				<Header color="orange" as="h1" content="Registration Complete" />
				<p style={{color: "white"}}>Please check your email to verify your account.</p>
				<Link href="/"><Button content="Home" icon="home" labelPosition="left"/></Link>
			</div>
		</div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const RegisteredContainer = connect(mapStateToProps, mapDispatchToProps)(Registered)
export default RegisteredContainer
