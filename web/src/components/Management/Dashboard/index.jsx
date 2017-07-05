import React from "react"
import { Tabs } from "antd"
import { Modal, ModalBody, ModalHeader } from "railway/components/Modal"
import ClientInfo from "railway/components/Clients/Info"
import UserTable from "railway/components/UserTable"
import history from "railway/history"
import "railway/components/Management/Dashboard/style.css"

const ManagementDashboard = (props) => {
	return (
		<Tabs defaultActiveKey="1">
			<Tabs.TabPane tab="Info" key="1"><ClientInfo /></Tabs.TabPane>
			<Tabs.TabPane tab="Users" key="2"><UserTable {...props} /></Tabs.TabPane>
		</Tabs >
	)
}

const ManagementDashboardModal = (props) => {
	return (
		<Modal
			style={{ minHeight: "80%", minWidth: "80%", padding: "50px" }}
			className="ManagementDashboard-modal"
			onClose={() => { history.push("/") }}
		>
			<ModalHeader>
				Management Dashboard
			</ModalHeader>
			<ModalBody>
				<ManagementDashboard {...props} />
			</ModalBody>
		</Modal>
	)
}

export default ManagementDashboardModal

