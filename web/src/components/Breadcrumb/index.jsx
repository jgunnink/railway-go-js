import React from "react"

import ClientsForm from "railway/components/Clients/Form"
import { connect } from "react-redux"
import { Breadcrumb, Icon } from "antd"
import { Link } from "react-router-dom"

const Breadcrumb = ({ crumbs }) => {
	return (
		<div>
			<Breadcrumb>
				{
					crumbs.map((crumb, i) => {
						<Breadcrumb.Item>
							<Link to={crumb.link}>
								<Icon type={crumb.icon} />
								<span>{crumb.name}</span>
							</Link>
						</Breadcrumb.Item>
					})
				}
			</Breadcrumb>
		</div>
	)
}

export default Breadcrumb
