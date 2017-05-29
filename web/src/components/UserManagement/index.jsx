import React from "react"
import { Button, Header, Message, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/common.css"

import UserTable from "./userTable.jsx"

const UserManagement = (props) => {
    const changeActiveScreen = props.changeActiveScreen
	const role = props.role
	const users = props.users
	const archiveUser = props.archiveUser
	
    return (
		<div>
			{role === "admin" && <Segment>
				<Header color="orange" as="h1" content="User manangement" />
				<p>
					This is the user management. Add new users to your account, 
					edit existing users or remove them from your account.
				</p>
				<UserTable users={users} archiveUser={archiveUser} />
				<p>
					When you archive a user, they are prevented from logging in,
					and their account becomes read only.
					<br />
					The content they create is not deleted or removed. An admin
					user can selectively remove any content as required.
				</p>
			</Segment> }
			{role !== "admin" && <div className="jumbotron vertical-center">
				<Message 
					negative header="Woops!" 
					content="You don't have permission to do that."/>
				<br/>
				<Link href="/dashboard">
					<Button color="orange" content="Go to dashboard" icon="right arrow" labelPosition="right" onClick={()=>{changeActiveScreen("dashboard")}}/>
				</Link>
			</div>}
		</div>
    )
}

export default UserManagement
