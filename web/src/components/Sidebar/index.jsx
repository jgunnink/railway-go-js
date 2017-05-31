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
		<div className="sidebar"><Segment inverted><Menu inverted vertical>
			<Menu.Item name="Dashboard" active={activeScreen === "dashboard"}>
				<Icon name="dashboard" />
				<Link href="/dashboard" onClick={()=>{changeActiveScreen("dashboard")}}>Dashboard</Link>
			</Menu.Item>
			<Menu.Item active={activeScreen === "account"}>
				<Icon name="user" />
				<Link href="/myaccount" onClick={()=>{changeActiveScreen("account")}}>My account</Link>
			</Menu.Item>
			{role === "admin" && <Menu.Item active={activeScreen === "userManagement"}>
				<Icon name="users" />
				<Link href="/admin/usermanagement" onClick={()=>{changeActiveScreen("userManagement")}}>User Management</Link>
			</Menu.Item> }
			<Menu.Item style={{color: "red"}} name="Logout">
				<Icon name="power" />
				<Link href="/logout" onClick={()=>{changeActiveScreen("home"); logout()}}>Logout</Link>
			</Menu.Item>				
		</Menu></Segment></div>
	)
}

export default SideBar
