import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6

import queryString from 'query-string'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as actions from '../../actions'
import {AUTH_ERROR} from "../../actions/types";

import {Form, Input, H1, A, P, Button, Span, Main} from "../../theme/elements"

const StyledField = styled(Field)`
	${Input}
`

class Signin extends Component {
 

constructor(props) {
	super(props)
	console.log('check if being signed in after signup')

	props.dispatch({type: AUTH_ERROR, payload: '' })
	// redirect back to portal if already signed in
	if (props.auth) {
		this.props.history.push('/account');
	} 

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
			<Main>
				
					<Form onSubmit={handleSubmit(this.onSubmit)}>
						<H1>Sign in </H1>
							<StyledField 
								name="email"
								type="text"
								component="input"
								autoComplete="none"
								placeholder="Email"
							/>
						
							<StyledField
								name="password"
								type="password"
								component="input"
								autoComplete="none"
								placeholder="Password"
							/>
						

						
						<Button>Sign In</Button>
						<Span>or</Span>
						<Link to="/signup">Create Account</Link>
						<Span>/</Span>
						<Link to="/forgot">Forgot Password</Link>

						{this.renderMessages()}

					</Form>

					{ verfied(this.props.unVerified, this.resendVerification)}
				

			</Main>
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


