import React from "react"
import { Table, Button, Modal as antModal } from "antd"
import { userFullName, capitalizeFirstLetter } from "railway/helpers/strings"
import { Link } from "react-router-dom"

const confirm = antModal.confirm

const UserTable = (props) => {
	let userMap
	let userData = []
	try {
		userMap = props.users.get("users")
		userData = userMap.map((user, i) => {
			return {
				key: user.get("id"),
				name: userFullName(user),
				email: user.get("email"),
				role: capitalizeFirstLetter(user.get("role"))
			}
		}).toArray()
	} catch (err) {
		userData = []
	}
	const userColumns = [{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: text => <div>{text}</div>,
	}, {
		title: "Email",
		dataIndex: "email",
		key: "email",
	}, {
		title: "Role",
		dataIndex: "role",
		key: "role",
	}, {
		title: "Action",
		key: "action",
		render: (text, record) => {
			const user = props.users.get("users").get(record.key.toString())
			if (user.toJS().disabled)
				return (
					<EnableUser userID={record.key} {...props } />
				)
			else
				return (
					<span>
						{/*Hover text would do well here to illustrate what the buttons do?*/}
						<EditUser userID={record.key} {...props} />
						<span className="ant-divider" />
						<DisableUser userID={record.key} {...props } />
						<span className="ant-divider" />
						<ArchiveUser userID={record.key} {...props } />
					</span>
				)
		}
	}]

	return (
		<div >
			<h2>Users</h2>
			<Table bordered columns={userColumns} dataSource={userData} />
		</div >
	)
}

const ArchiveUser = ({ users, userID, archiveUser, record }) => {
	const user = users.get("users").get(userID.toString())
	function showConfirm() {
		confirm({
			title: "Are you sure you want to archive this user?",
			content: "This will archive the user removing them from view. This cannot be undone. Please be certain.",
			onOk() { archiveUser(user) },
			onCancel() { },
		})
	}
	return (<Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />)
}

const DisableUser = ({ users, userID, disableUser, record }) => {
	const user = users.get("users").get(userID.toString())
	function showConfirm() {
		confirm({
			title: "Are you sure you want to disable this user?",
			content: "Disabling a user account prevents them from accessing this system.",
			onOk() { disableUser(user) },
			onCancel() { },
		})
	}
	return (<Button shape="circle" icon="lock" onClick={showConfirm} />)
}

const EditUser = ({ userID }) => {
	return (
		<Link to={`management/user/update/${userID}`}>
			<Button shape="circle" icon="edit" />
		</Link >
	)
}

const EnableUser = ({ users, userID, enableUser, record }) => {
	const user = users.get("users").get(userID.toString())
	function showConfirm() {
		confirm({
			title: "This will re-enable this user account.",
			content: "They will regain access to this system.",
			onOk() { enableUser(user) },
			onCancel() { },
		})
	}
	return (<Button shape="circle" icon="unlock" onClick={showConfirm} />)
}

export default UserTable
