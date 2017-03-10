import React from "react"
import { Field, reduxForm } from 'redux-form/immutable' 
import { Button, Container, Form, Header, Message } from "semantic-ui-react"
import { renderInput, renderCheckbox } from '../../helpers/renderField'
import validate from './validate'

const submit = (values, dispatch, props) => {
	return props.signup(values)
}

const errorMessage = (errorCode) => {
	switch (errorCode) {
		case 400:
      return (<Message negative>That email address has already been registered!</Message>)
    case 500:
      return (<Message negative>A server error has occured. The administrators have been notified. Please try again later.</Message>)
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
