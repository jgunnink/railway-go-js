import React from "react"
import { connect } from "react-redux"
import { Button, Header } from "semantic-ui-react"
import { Link } from "redux-little-router"

const Registered = (props) => {  
  	return (
		<div className="vertical-center jumbotron-landing">
			<Header style={{color: "white"}} as="h1" content="Registration complete" />
			<p>Please check your email to verify your account.</p>
			<Link href="/">
				<Button
					content="Home"
					icon="right arrow"
					labelPosition="right"
					color="orange"
				/>
			</Link>
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
