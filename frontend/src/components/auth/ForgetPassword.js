import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import queryString from 'query-string'


import { Link } from 'react-router-dom';
import * as actions from '../../actions'
import {AUTH_ERROR} from "../../actions/types";


class ForgetPassword extends Component {
 

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
 
sendCode = formProps => {

    this.props.resetPassword(formProps, () => {
		this.props.history.push(`/reset/${this.props.setPasswordForEmail}`);
    });
};

verifyCode = formProps => {

		this.props.verifyCode(formProps, () => {

		});
};

resendVerification = () => {
    this.props.resendVerification(this.props.unVerified, () => {
        console.log('ok')
    });
   
};

	renderMessages = () => {
		if (this.props.errorMessage) {
			return(
				<div className="message message--error">{this.props.errorMessage} </div>
			)
		}
		if (this.props.generalMessage) {
			return(
				<div className="message message--success">{this.props.errorMessage} </div>
			)
		}
	}
	

	render() {
		const {handleSubmit} = this.props;

		function verfied(email, action) {
			if (email) {
				return (
					<div>
						<button onClick={action}>Resend</button>
						verification for {email}
					</div>
				)
			}
		}

		function renderLoading(waitingReply) {
			console.log(`--> ${waitingReply}`)
			if (waitingReply) {
				return (
					<div> ... </div>
				)
			}
		}


		return (
			<div className="signin">
				<h1>Password Reset</h1>
				<form onSubmit={handleSubmit(this.sendCode)}>
					<fieldset>
						<Field
							name="email"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="Email"
						/>
					</fieldset>
					<button>Send Code</button>

					{this.renderMessages()}
					{renderLoading(this.props.waitingReply)}
				</form>
				{verfied(this.props.unVerified, this.resendVerification)}
				<div>{this.props.setPasswordForEmail} </div>
			</div>
		)


	}
}



function mapeStateToProps(state) {
	return { 
		errorMessage: state.auth.errorMessage,
		unVerified: state.auth.unVerified,
	    waitingReply: state.auth.waitingReply,
	    auth: state.auth.authenticated,
		setPasswordForEmail: state.auth.setPasswordForEmail
	}
}

export default compose(
	connect(mapeStateToProps, actions),
	reduxForm({ form: 'forgetPassword'})
)(ForgetPassword);