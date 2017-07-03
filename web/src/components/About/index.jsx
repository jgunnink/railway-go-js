import React from "react"

const About = (props) => {
	return (
		<div>
			<h2>About</h2>
			<p>Airsscope's project: railway!</p>
			<h3>React router provides locations through props, which are mutable</h3>
			<p>The location of this url is available as a string with the following command</p>
			<p>props.history.location.pathname = {props.history.location.pathname}</p>
		</div>
	)
}

export default About
