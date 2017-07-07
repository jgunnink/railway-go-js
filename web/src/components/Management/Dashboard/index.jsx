import React from "react"
import { Tabs } from "antd"
import ClientInfo from "railway/components/Management/Info"
import UserTable from "railway/components/Management/UserTable"
import ClientTable from "railway/containers/Clients/All"
import "railway/components/Management/Dashboard/style.css"

const ManagementDashboard = (props) => {
	return (
		<div style={{ padding: "30px" }}>
			<h1>Management Dashboard</h1>
			<Tabs defaultActiveKey={props.defaultActiveKey}>
				<Tabs.TabPane tab="Info" key="info"><ClientInfo /></Tabs.TabPane>
				<Tabs.TabPane tab="Users" key="users" ><UserTable {...props} /></Tabs.TabPane>
				<Tabs.TabPane tab="Clients" key="clients"><ClientTable /></Tabs.TabPane>
			</Tabs >
		</div>
	)
}

export default ManagementDashboard
