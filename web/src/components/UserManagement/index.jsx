import React from "react"
import { Button, Header, Message, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "../../../assets/css/common.css"

import UserTable from "./userTable.jsx"

const UserManagement = (props) => {
    const changeActiveScreen = props.changeActiveScreen
	const role = props.role
  
    return (
		<div>
			{role === "admin" && <Segment>
				<Header color="orange" as="h1" content="User manangement" />
				<p>
					This is the user management. Add new users to your account, 
					edit existing users or remove them from your account.
				</p>
				<UserTable />
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
