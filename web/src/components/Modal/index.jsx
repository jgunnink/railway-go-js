import React from "react"

import "railway/components/Modal/modal.css"
import { Icon } from "antd"
export const ModalHeader = (props) => (
	<div><h1>{props.children}</h1></div>
)

export const ModalActions = (props) => (
	<div className="modal-actions">
		<div>{props.children}</div>
	</div>
)

export const ModalBody = (props) => {
	const modalHeight = window.innerHeight - 160
	return (
		<div className="modal-body" style={{ maxHeight: modalHeight, overflowY: "auto" }}>
			<div>{props.children}</div>
		</div>
	)
}

export const Modal = (props) => {
	let close
	let style = props.style || {}

	if (typeof props.onClose === "function") {
		close = <span style={{ "position": "absolute", "top": 10, "right": 10, "zIndex": 9001 }}>
			<a href="/" onClick={(e) => {
				e.preventDefault()
				props.onClose()
			}}><Icon type="close" />
			</a>
		</span>
	}
	return (
		<div className="modal-dimmer">
			<div className="modal" style={style}>
				{close}
				{props.children}
			</div>
		</div>
	)
}
