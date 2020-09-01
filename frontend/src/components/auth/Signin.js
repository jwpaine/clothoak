import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import queryString from 'query-string'
import PulseLoader from "react-spinners/ClipLoader";

import { Link } from 'react-router-dom';
import * as actions from '../../actions'
import {AUTH_ERROR} from "../../actions/types";


class Signin extends Component {
 

constructor(props) {
	super(props)
	console.log('check if being signed in after signup')

	props.dispatch({type: AUTH_ERROR, payload: '' })
	// redirect back to portal if already signed in
// 	if (props.auth) {
// 		this.props.history.push('/account');
// 	}

}



 
static contextTypes = {
    router: PropTypes.object
}
 
onSubmit = formProps => {

	console.log('onsubmit clicked')



    this.props.signin(formProps, () => {
		// if (this.props.authenticated) {
		// 	this.props.loadCartPrivate(() => {
		// 	});
		// } else {
		// 	this.props.loadCart(() => {
		// 	});
		// }
		let next = queryString.parse(this.props.location.search).next;

		if(next) {
			this.props.history.push(`/${next}`);
		} else {
			this.props.history.push('/cart');
		}


    });
};

resendVerification = () => {
    this.props.resendVerification(this.props.unVerified, () => {
        console.log('ok')
    });
   
};


renderMessages = () => {
	
	if (this.props.successMessage) {
		console.log(`success message: ${this.props.successMessage}`)
		return(
			<div className="message message--success">{this.props.successMessage} </div>
		)
	}
	if (this.props.errorMessage) {
		return(
			<div className="message message--error">{this.props.errorMessage} </div>
		)
	}
}



	render() {
		const { handleSubmit } = this.props;

		function verfied(email, action) {
			if(email) {
				return(
					<div>
					<button onClick={action}>Resend</button> verification for {email}
					</div>
				)
			}
		}

		function renderLoading(waitingReply) {
			console.log(`--> ${waitingReply}`)
			if (waitingReply) {
				return(
					<div> ... </div>
				)
			}
		}

		return (
			<div className="signin">

					<h1>Sign in </h1>

				<form onSubmit={handleSubmit(this.onSubmit)}>
					<fieldset>
						<Field
							name="email"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="Email"
						/>
					</fieldset>
					<fieldset>
						<Field
							name="password"
							type="password"
							component="input"
							autoComplete="none"
							placeholder="Password"
						/>
					</fieldset>

					
					<button>Sign In</button>
					<p>or</p>
					<Link to="/signup">Create Account</Link>
					<p>/</p>
					<Link to="/forgot">Forgot Password</Link>

					{this.renderMessages()}

					{/* { renderLoading(this.props.waitingReply) } */}
					<PulseLoader
						size={150}
						color={"#123abc"}
						css="position:absolute;"
						loading={this.props.waitingReply}
						
					/>
				</form>

				{ verfied(this.props.unVerified, this.resendVerification)}

			</div>
		)
	}
}


function mapeStateToProps(state) {
	return { 
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		unVerified: state.auth.unVerified,
	    waitingReply: state.auth.waitingReply,
	    auth: state.auth.authenticated,
		msg_general : state.messages.general
	}
}

export default compose(
	connect(mapeStateToProps, actions),
	reduxForm({ form: 'signin'})
)(Signin);