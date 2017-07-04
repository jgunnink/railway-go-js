import React from "react"
import { Menu, Icon } from "antd"
import { Link } from "react-router-dom"
import SiteTree from "railway/components/SiteTree"

const SubMenu = Menu.SubMenu

const Horizontal = (props) => {
	const { role, logout, setActiveScreen } = props
	return (
		<Menu theme="light" mode="horizontal" onClick={({ key }) => { setActiveScreen(key) }}>
			<SubMenu title={<span><Icon type="home" />Sites</span>}>
				<SiteTree {...props} />
			</SubMenu>
			{
				role === "orange" &&
				<Menu.Item key="manage">
					<Link to="/admin/clients/all">
						<Icon type="team" />
						Manage
					</Link>
				</Menu.Item>
			}
			{
				role === "admin" &&
				<Menu.Item key="manage">
					<Link to="/client/dashboard">
						<Icon type="team" />
						Manage
					</Link>
				</Menu.Item>
			}
			<Menu.Item style={{ float: "right" }} key="logout">
				<Link to="/auth/sign_out" onClick={() => { logout() }}>
					<Icon type="logout" />
					Logout
				</Link>
			</Menu.Item>
		</Menu>
	)
}

export default Horizontal
