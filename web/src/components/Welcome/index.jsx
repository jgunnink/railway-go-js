import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import { Link } from 'redux-little-router'
import '../../../assets/css/landing_page.css'

const Welcome = (props) => {
  console.log(props)
  const changeActiveScreen = props.changeActiveScreen
  
  return (
    <div className='vertical-center'>
      <Header color='orange' as='h1'>
        <Header.Content>
          Railway
        </Header.Content>
      </Header>
      <div>
        <Link className='anything' href='/signup'>
          <Button content='Sign Up' icon='pencil' labelPosition='left' onClick={()=>{changeActiveScreen("signup")}}/>
        </Link>
        <Button color='orange' content='Log in' icon='right arrow' labelPosition='right' />
      </div>
    </div>
  )
}

export default Welcome
