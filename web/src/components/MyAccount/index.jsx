import React from "react"
import { Field, reduxForm } from "redux-form/immutable"
import { renderInput } from "../../helpers/renderField"
import { Button, Form, Header, Message, Segment } from "semantic-ui-react"
import validate from "../SignupForm/validate"
import { SubmissionError } from "redux-form"

const submit = (values, dispatch, props) => {
	return props.accountUpdate(dispatch, values)
	.then((res) => {
	}).catch((err) => {
		throw new SubmissionError({ email: "Please use another email address" })
	})
}

const errorMessage = (errorCode) => {
	switch (errorCode) {
	case 500:
		return (<Message negative header="Internal server error" content="A server error has occured. The administrators have been notified. Please try again later." />)
	default:
		return (<div/>)
	}
}

const AccountDetailsForm = reduxForm({form: "accountUpdate", validate}) (({errorCode, handleSubmit, pristine, submitting}) => (
	<Segment>
		{errorCode && errorMessage(errorCode)}
		<Header color="orange" as="h1">My details</Header>
		<Form onSubmit={handleSubmit(submit)}>
			<Field name="first" label="First Name" component={renderInput}/>
			<Field name="last" label="Last Name" component={renderInput}/>
			<Field name="email" label="Email Address" component={renderInput}/>
			<Field name="password" label="Password" type="Password" component={renderInput}/>
			<Button disabled={pristine || submitting} type="submit">Save</Button>
		</Form>
	</Segment>
))

export default AccountDetailsForm
