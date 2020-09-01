import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signout extends Component {
	componentDidMount() {
		// this.props.signout();
		this.props.signout(() => {
        // this.context.router.history.push('/portal');
        	this.props.history.push('/signin');
    	});
	}
	render() {
		return <div>Logged out</div>
	}
}

export default connect(null, actions)(Signout);