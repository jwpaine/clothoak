import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {
	class ComposedComponent extends Component {
		componentDidMount() {
			console.log('requiredAuth mounted')
			this.shouldNavigateAway(); 
		}
	

	shouldNavigateAway() {
		if (!this.props.auth) {
			this.props.history.push('/signin');
		} else {
			this.props.refreshSession(() => {

			})
		}
	}

	render() {
		return <ChildComponent {...this.props} />;
	}
}

function mapStateToProps(state) {
	return { auth: state.auth.authenticated };
}
return connect(mapStateToProps)(ComposedComponent);

};
