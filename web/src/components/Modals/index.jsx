import React from "react"
import "./modal.css"
import { Header, Icon } from "semantic-ui-react"

export const ModalHeader = (props) => (
	<Header>{props.children}</Header>
)

export const ModalActions = (props) => (
	<div className="modal-actions">
		{props.children}
	</div>
)

export const ModalBody = (props) => {
	const modalHeight = window.innerHeight - 160
	return (
		<div className="modal-body" style={{ maxHeight: modalHeight, overflowY: "auto" }}>
			{props.children}
		</div>
	)
}

export const Modal = (props) => {
	let close
	let style = props.style || {}
	if (typeof props.onClose === "function") {
		close = <span style={{ "position": "absolute", "top": 10, "right": 10, "zIndex": 9001 }}>
			<a href="#" onClick={(e) => {e.preventDefault(); props.onClose()}}>
				<Icon name="close" />
			</a>
		</span>
	}
	return (
		<div className="modal-dimmer">
			<div className="modal" style={{ style }}>
				{close}
				{props.children}
			</div>
		</div>
	)
}
