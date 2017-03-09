import React from 'react'
import { Button, Checkbox, Container, Form, Header } from 'semantic-ui-react'

const SignupForm = () => (
  <Container>
    <Header color='orange' as='h1'>
      <Header.Content>
        Signup
      </Header.Content>
    </Header>
    <Form inverted method='POST' action="/api/register">
      <Form.Field>
        <label>First Name</label>
        <input name='first' placeholder='First Name' />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input name='last' placeholder='Last Name' />
      </Form.Field>
      <Form.Field>
        <label>Email Address</label>
        <input name='email' placeholder='Email' />
      </Form.Field>
      <Form.Input name='password' label='Password' type='password' />
      <Form.Field>
        <Checkbox label='I agree to the Terms and Conditions' />
      </Form.Field>
      <Button type='submit'>Register</Button>
    </Form>
  </Container>
)

export default SignupForm
