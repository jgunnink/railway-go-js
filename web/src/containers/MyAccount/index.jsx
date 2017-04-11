import React from 'react'
import MyAccount from '../../components/MyAccount'
import { connect } from 'react-redux'

const UserAccount = (props) => {
  return(
	  <MyAccount />
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const UserAccountContainer = connect(mapStateToProps, mapDispatchToProps)(UserAccount)
export default UserAccountContainer
