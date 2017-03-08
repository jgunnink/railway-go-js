import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import '../assets/css/landing_page.css'
import { Link } from 'react-router-dom'

const Home = () => (
  <div className='vertical-center'>
    <Header color='orange' as='h1'>
      <Header.Content>
        Railway
      </Header.Content>
    </Header>
    <div>
      <Link to="/signup"><Button content='Sign Up' icon='pencil' labelPosition='left' /></Link>
      <Button color='orange' content='Log in' icon='right arrow' labelPosition='right' />
    </div>
  </div>
)

export default Home
