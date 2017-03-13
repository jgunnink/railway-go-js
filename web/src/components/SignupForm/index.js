import React from "react"
import { Field, reduxForm } from 'redux-form/immutable' 
import { Button, Container, Form, Header, Message } from "semantic-ui-react"
import { renderInput, renderCheckbox } from '../../helpers/renderField'
import validate from './validate'
import { SubmissionError } from 'redux-form'

const submit = (values, dispatch, props) => {
	return props.signup(dispatch, values)
    .then((res) => {
    }).catch((err) => {
      throw new SubmissionError({ email: "Please use another email address" })
    })
}

const errorMessage = (errorCode) => {
	switch (errorCode) {
		case 400:
      return (<Message negative header="Already taken!" content="That email address has already been registered. Please use another email, or reset your password if you've forgotten it."/>)
    case 500:
      return (<Message negative header="Internal server error" content="A server error has occured. The administrators have been notified. Please try again later." />)
		default:
			return (<div/>)
	}
}

const SignupForm = reduxForm({form: 'signup', validate}) (({errorCode, handleSubmit, pristine, submitting}) => (
  <Container>
    {errorCode && errorMessage(errorCode)}
    <Header color="orange" as="h1">Signup</Header>
    <Form inverted onSubmit={handleSubmit(submit)}>
      <Field name="first" label="First Name" component={renderInput}/>
      <Field name="last" label="Last Name" component={renderInput}/>
      <Field name="email" label="Email Address" component={renderInput}/>
      <Field name="password" label="Password" type="Password" component={renderInput}/>
      <Field name="agreement" label="I agree to the Terms and Conditions" component={renderCheckbox}/>
      <Button disabled={pristine || submitting} type="submit">Register</Button>
    </Form>
  </Container>
))

export default SignupForm