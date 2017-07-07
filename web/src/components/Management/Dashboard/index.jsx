import React from "react"
import { Tabs } from "antd"
import ClientInfo from "railway/components/Clients/Info"
import UserTable from "railway/components/Management/UserTable"
import ClientTable from "railway/containers/Clients/All"
import "railway/components/Management/Dashboard/style.css"

const ManagementDashboard = (props) => {
	return (
		<div style={{ padding: "30px" }}>
			<h1>Management Dashboard</h1>
			<Tabs defaultActiveKey="1">
				<Tabs.TabPane tab="Info" key="1"><ClientInfo /></Tabs.TabPane>
				<Tabs.TabPane tab="Users" key="2"><UserTable {...props} /></Tabs.TabPane>
				<Tabs.TabPane tab="Clients" key="3"><ClientTable /></Tabs.TabPane>
			</Tabs >
		</div>
	)
}

export default ManagementDashboard
