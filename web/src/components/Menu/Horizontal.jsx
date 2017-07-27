import React from "react"
import { Menu, Icon } from "antd"
import { Link } from "react-router-dom"

const Horizontal = props => {
	const { role, logout, setActiveScreen } = props
	return (
		<Menu
			theme="dark"
			mode="horizontal"
			defaultSelectedKeys={["home"]}
			onClick={({ key }) => {
				setActiveScreen(key)
			}}>
			<Menu.Item key="home">
				<Link to="/">
					<Icon type="home" />
					Home
				</Link>
			</Menu.Item>
			{role === "admin" &&
				<Menu.Item key="manage">
					<Link to="/management">
						<Icon type="team" />
						Manage
					</Link>
				</Menu.Item>}
			<Menu.Item style={{ float: "right" }} key="logout">
				<Link
					to="/auth/sign_out"
					onClick={() => {
						logout()
					}}>
					<Icon type="logout" />
					Logout
				</Link>
			</Menu.Item>
		</Menu>
	)
}

export default Horizontal
