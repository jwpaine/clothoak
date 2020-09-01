import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import queryString from 'query-string'


import { Link } from 'react-router-dom';
import * as actions from '../../actions'
import {AUTH_ERROR} from "../../actions/types";


class ResetPassword extends Component {
 

constructor(props) {
	super(props)
	console.log('check if being signed in after signup')

	props.dispatch({type: AUTH_ERROR, payload: '' })
	// redirect back to portal if already signed in
// 	if (props.auth) {
// 		this.props.history.push('/account');
// 	}

	console.log(`setPasswordForEmail: ${props.match.params.email}`)

}


renderMessages = () => {
		if (this.props.errorMessage) {
			return(
				<div className="message message--error">{this.props.errorMessage} </div>
			)
		}
		if (this.props.match.params.email) {
			return(
				<div className="message message--success">Code sent to {this.props.match.params.email} </div>
			)
		}
	}
 
static contextTypes = {
    router: PropTypes.object
}
 
sendCode = formProps => {

    this.props.resetPassword(formProps, () => {

    });
};

verifyCode = formProps => {

		this.props.verifyCode(formProps, () => {
			// @TODO: implement splash page compoent, that accepts redirect link and text
			this.props.history.push('/signin');
		});
};

resendVerification = () => {
    this.props.resendVerification(this.props.unVerified, () => {
        console.log('ok')
    });
   
};


	

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


			// @TODO: clear fields!
			return (
				<div className="signin">
					<h1>Set New Password</h1>
					<form onSubmit={handleSubmit(this.verifyCode)}>
						<fieldset>
							<Field
								name="code"
								type="text"
								component="input"
								autoComplete="none"
								placeholder="code"
							/>
						</fieldset>
						<fieldset>
							<Field
								name="password"
								type="password"
								component="input"
								autoComplete="none"
								placeholder="password"
							/>
						</fieldset>
						<button>Set Password</button>
						<Link to={`/forgot`}>Resend Code</Link>
						{this.renderMessages()}
						{renderLoading(this.props.waitingReply)}
					</form>
					{verfied(this.props.unVerified, this.resendVerification)}
				</div>
			)


		// return (
		// 	<div className="signin">
		// 		<h1>Password Reset</h1>
		// 		<form onSubmit={handleSubmit(this.sendCode)}>
		// 			<fieldset>
		// 				<Field
		// 					name="email"
		// 					type="text"
		// 					component="input"
		// 					autoComplete="none"
		// 					placeholder="Email"
		// 				/>
		// 			</fieldset>
		// 			<button>Send Code</button>
		// 			<div>{this.props.errorMessage} </div>
		// 			{renderLoading(this.props.waitingReply)}
		// 		</form>
		// 		{verfied(this.props.unVerified, this.resendVerification)}
		// 		<div>{this.props.setPasswordForEmail} </div>
		// 	</div>
		// )


	}
}



function mapStateToProps(state, props) {
	return { 
		errorMessage: state.auth.errorMessage,
		unVerified: state.auth.unVerified,
	    waitingReply: state.auth.waitingReply,
	    auth: state.auth.authenticated,
		initialValues: {
			email : props.match.params.email
		}
	}
}

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({
		form: 'resetPassword',
		enableReinitialize: true
	})
)(ResetPassword);