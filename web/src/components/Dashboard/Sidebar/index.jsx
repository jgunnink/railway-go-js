import React from "react"
import { Icon, Menu, Segment } from "semantic-ui-react"
import { Link } from "redux-little-router"
import "./custom.css"

const SideBar = (props) => {
	const changeActiveScreen = props.changeActiveScreen
	const activeScreen = props.activeScreen
	const logout = props.logout

	return (
		<div className="sidebar">
			<Segment inverted>
				<Menu inverted vertical>
					<Menu.Item name="Dashboard" active={activeScreen === "dashboard"}><Icon name="dashboard" /><Link href="/dashboard" onClick={()=>{changeActiveScreen("dashboard")}}>Dashboard</Link></Menu.Item>
					<Menu.Item>
						<Menu.Header>My Account</Menu.Header>
						<Menu.Menu>
							<Menu.Item name="My Account" active={activeScreen === "account"}>
							<Icon name="user" />
								<Link href="/myaccount" onClick={()=>{changeActiveScreen("dashboard")}}>My profile</Link>
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Menu>
							<Menu.Item name="Logout">
								<Icon name="power" />
								<Link href="/logout" onClick={()=>{changeActiveScreen("home"); logout()}}>Logout</Link>
							</Menu.Item>
						</Menu.Menu>
					</Menu.Item>					
				</Menu>
			</Segment>
		</div>
	)
}

export default SideBar
