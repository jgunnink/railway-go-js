import React from "react"
import { Icon, Menu, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "./custom.css"

const SideBar = (props) => {
	const changeActiveScreen = props.changeActiveScreen
	const activeScreen = props.activeScreen
	const logout = props.logout
	const role = props.role

	return (
		<div className="sidebar">
			<Segment inverted>
				<Menu inverted vertical>
					<Menu.Item name="Dashboard" active={activeScreen === "dashboard"}><Icon name="dashboard" /><Link href="/dashboard" onClick={()=>{changeActiveScreen("dashboard")}}>Dashboard</Link></Menu.Item>
					<Menu.Item active={activeScreen === "account"}>
						<Menu.Header>My Account<Icon name="user" style={{float:"right"}} /></Menu.Header>
						<Menu.Menu>
							<Menu.Item>
								<Link href="/myaccount" onClick={()=>{changeActiveScreen("account")}}>Edit account</Link>
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					{role === "admin" && <Menu.Item>
						<Menu.Header>
							<Link style={{color: "white"}}href="/admin/usermanagement" onClick={()=>{changeActiveScreen("userManagement")}}>User Management</Link>
							<Icon name="users" style={{float:"right"}} />
						</Menu.Header>
					</Menu.Item> }
					<Menu.Item>
						<Menu.Header>
							<Link style={{color: "white"}}href="/logout" onClick={()=>{changeActiveScreen("home"); logout()}}>Logout</Link>
							<Icon name="power" style={{float:"right"}} />
						</Menu.Header>
					</Menu.Item>					
				</Menu>
			</Segment>
		</div>
	)
}

export default SideBar
