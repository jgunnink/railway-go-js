import React from "react"
import { Button, Modal, Table, Tooltip } from "antd"
import { userFullName, capitalizeFirstLetter } from "railway/helpers/strings"
import { Link } from "react-router-dom"

const confirm = Modal.confirm

const UserTable = props => {
	let userMap
	let userData = []
	try {
		userMap = props.users.get("users")
		userData = userMap
			.map((user, i) => {
				return {
					key: user.get("id"),
					name: userFullName(user),
					email: user.get("email"),
					role: capitalizeFirstLetter(user.get("role"))
				}
			})
			.toArray()
	} catch (err) {
		userData = []
	}
	const userColumns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: text =>
				<div>
					{text}
				</div>
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email"
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role"
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => {
				const user = props.users.get("users").get(record.key.toString())
				if (user.toJS().disabled) return <EnableUser userID={record.key} {...props} />
				else
					return (
						<span>
							<Tooltip placement="top" title={<span>Edit User</span>}>
								<span>
									<EditUser userID={record.key} {...props} />
								</span>
							</Tooltip>
							<span>
								<Tooltip placement="top" title={<span>Disable this user</span>}>
									<span>
										<DisableUser userID={record.key} {...props} />
									</span>
								</Tooltip>
								<Tooltip placement="top" title={<span>Send password reset email</span>}>
									<span>
										<ResetUserPassword userID={record.key} {...props} />
									</span>
								</Tooltip>
								<Tooltip placement="top" title={<span>Archive this user</span>}>
									<span>
										<ArchiveUser userID={record.key} {...props} />
									</span>
								</Tooltip>
							</span>
						</span>
					)
			}
		}
	]

	return (
		<div>
			<h2>Users</h2>
			<Table bordered columns={userColumns} dataSource={userData} />
		</div>
	)
}

const ArchiveUser = ({ archiveUser, currentUser, record, users, userID }) => {
	const user = users.get("users").get(userID.toString())
	if (currentUser.id === user.toJS().id) {
		return <div />
	}

	function showConfirm() {
		confirm({
			title: "Are you sure you want to archive this user?",
			content: "This will archive the user removing them from view. This cannot be undone. Please be certain.",
			onOk() {
				archiveUser(user)
			},
			onCancel() {}
		})
	}
	return <Button shape="circle" type="danger" icon="delete" onClick={showConfirm} />
}

const DisableUser = ({ currentUser, disableUser, record, users, userID }) => {
	const user = users.get("users").get(userID.toString())
	if (currentUser.id === user.toJS().id) {
		return <div />
	}

	function showConfirm() {
		confirm({
			title: "Are you sure you want to disable this user?",
			content: "Disabling a user account prevents them from accessing this system.",
			onOk() {
				disableUser(user)
			},
			onCancel() {}
		})
	}
	return <Button shape="circle" icon="lock" onClick={showConfirm} />
}

const EditUser = ({ userID }) => {
	return (
		<Link to={`/management/users/${userID}/update`}>
			<Button shape="circle" icon="edit" />
		</Link>
	)
}

const EnableUser = ({ users, userID, enableUser, record }) => {
	const user = users.get("users").get(userID.toString())
	function showConfirm() {
		confirm({
			title: "This will re-enable this user account.",
			content: "They will regain access to this system.",
			onOk() {
				enableUser(user)
			},
			onCancel() {}
		})
	}
	return <Button shape="circle" icon="unlock" onClick={showConfirm} />
}

const ResetUserPassword = props => {
	const { users, userID, sendPasswordReset } = props
	const user = users.get("users").get(userID.toString())
	let disabled = false
	if (user.get("role") === "airscope") {
		disabled = true
	}
	if (disabled) return <div />
	function showConfirm() {
		confirm({
			title: "Send password reset email?",
			content: `The user will receive password reset instructions in an
			email, explaining how to set a new password.`,
			onOk() {
				sendPasswordReset(user)
			},
			onCancel() {}
		})
	}
	return <Button shape="circle" icon="key" onClick={showConfirm} />
}

export default UserTable
