import React from 'react'
import { Button, Checkbox, Container, Form } from 'semantic-ui-react'

const SignupForm = () => (
  <Container>
    <Form inverted>
      <Form.Field>
        <label>First Name</label>
        <input placeholder='First Name' />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input placeholder='Last Name' />
      </Form.Field>
      <Form.Field>
        <label>Email Address</label>
        <input placeholder='Email' />
      </Form.Field>
      <Form.Field>
        <Checkbox label='I agree to the Terms and Conditions' />
      </Form.Field>
      <Button type='submit'>Submit</Button>
    </Form>
  </Container>
)

export default SignupForm
