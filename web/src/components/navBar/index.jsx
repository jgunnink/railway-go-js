import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class navigationBar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}><Link to='/'>Home</Link></Menu.Item>
          <Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.handleItemClick}><Link to='/signup'>Signup</Link></Menu.Item>
        </Menu>
      </Segment>
    )
  }
}