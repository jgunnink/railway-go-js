import React from "react"
import { Field, reduxForm } from 'redux-form/immutable' 
import { Button, Container, Form, Header } from "semantic-ui-react"
import { renderInput, renderCheckbox } from '../../helpers/renderField'
import validate from './validate'

const submit = (values, dispatch, props) => {
	return props.signup(values)
}

const SignupForm = reduxForm({form: 'signup', validate}) (({handleSubmit, pristine, submitting}) => (
  <Container>
    <Header color="orange" as="h1">Signup</Header>
    <Form inverted onSubmit={handleSubmit(submit)}>
      <Field name="first" label="First Name" component={renderInput} />
      <Field name="last" label="Last Name" component={renderInput} />
      <Field name="email" label="Email Address" component={renderInput} />
      <Field name="password" label="Password" type="Password" component={renderInput} />
      <Field name="agreement" label="I agree to the Terms and Conditions" component={renderCheckbox} />
      <Button disabled={pristine || submitting} type="submit">Register</Button>
    </Form>
  </Container>
))

export default SignupForm
