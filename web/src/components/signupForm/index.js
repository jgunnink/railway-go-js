import React from "react"
import { reduxForm } from 'redux-form'
import { Button, Container, Form, Header } from "semantic-ui-react"
import { signup } from '../../store/actions/signup'

const submit = (values, dispatch) => {
	return dispatch(signup(values))
}

const SignupForm = reduxForm({form: 'signup'}) (({handleSubmit}) => (
  <Container>
    <Header color="orange" as="h1">Signup</Header>
    <Form inverted onSubmit={handleSubmit(submit)}>
      <Form.Input name="first" label="First Name" placeholder="First Name" />
      <Form.Input name="last" label="Last Name" placeholder="Last Name" />
      <Form.Input name="email" label="Email Address" placeholder="Email" />
      <Form.Input name="password" label="Password" type="password" />
      <Form.Checkbox label="I agree to the Terms and Conditions" />
      <Button type="submit">Register</Button>
    </Form>
  </Container>
))

export default SignupForm


// method="POST" action="/api/register"