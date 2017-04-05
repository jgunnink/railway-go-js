import React from "react"
import { Field, reduxForm } from "redux-form/immutable"
import { Button, Container, Form, Header, Message } from "semantic-ui-react"
import { renderInput } from "../../helpers/renderField"
import validate from "../SignupForm/validate"
import { SubmissionError } from "redux-form"

const submit = (values, dispatch, props) => {
  return props.login(dispatch, values)
  .then((res) => {
  }).catch((err) => {
    throw new SubmissionError({ password: "That password was incorrect, please try again." })
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

const LoginForm = reduxForm({form: "login", validate}) (({errorCode, handleSubmit, pristine, submitting}) => (
  <Container>
    {errorCode && errorMessage(errorCode)}
    <Header color="orange" as="h1">Login</Header>
    <Form inverted onSubmit={handleSubmit(submit)}>
      <Field name="email" label="Email Address" component={renderInput}/>
      <Field name="password" label="Password" type="Password" component={renderInput}/>
      <Button disabled={pristine || submitting} type="submit">Login</Button>
    </Form>
  </Container>
))

export default LoginForm
