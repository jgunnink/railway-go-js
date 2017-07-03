import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"

const mapDispatchToProps = (dispatch) => {
	return {
		__hoc_dispatch: dispatch
	}
}

const Needs = (options, needs) => (WrappedComponent) => {
	return connect((state, ownProps) => {
		let propObject = {}
		for (let i = 0; i < needs.length; i++) {
			const { name, path } = needs[i]
			propObject[name] = state.getIn(path)
		}

		return propObject
	}, mapDispatchToProps)(withRouter(class Needful extends React.Component {
		componentWillMount() {
			for (let i = 0; i < needs.length; i++) {
				const { name, action } = needs[i]
				if (this.props[name].get("loaded") === false && this.props[name].get("sendingRequest") !== true) {
					this.props.__hoc_dispatch(action())
				}
			}
		}
		shouldComponentUpdate(nextProps, nextState) {
			let should = true
			if (options.optimize === true && this.props.location === nextProps.location) {
				should = false
				for (let i = 0; i < needs.length; i++) {
					const { name } = needs[i]
					if (this.props[name] !== nextProps[name]) {
						should = true
						break
					}
				}
			}
			return should
		}
		render() {
			return <WrappedComponent {...this.props} />
		}
	}))
}

export default Needs
