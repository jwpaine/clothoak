import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as actions from '../../actions'
import {AUTH_ERROR} from "../../actions/types";
import {Form, Input, H1, A, P, Button, Span, Main} from "../../theme/elements"

const StyledField = styled(Field)`
	${Input}
`



class Signup extends Component {

constructor(props) {
	super(props)
	// redirect back to portal if already signed in
	console.log(this.props.history)
	if (props.auth) {
		this.props.history.push('/portal');
	}

	props.dispatch({type: AUTH_ERROR, payload: '' })

}
 
static contextTypes = {
    router: PropTypes.object
}
 
onSubmit = formProps => {
    this.props.signup(formProps, () => {
      
      this.context.router.history.push('/signin');

    });
};

componentDidUpdate(props) {
    console.log(this.props)
}

renderSuccess = (props) => {
    let message = this.props.successMessage
    if (message) {
         if( !message.userConfirmed ) {
             return ( <div className="successMessage"> Confirmation code sent to {JSON.stringify(message.codeDeliveryDetails.Destination)} </div> )
         }
    }
}	
	render() {
		const { handleSubmit } = this.props;
		return (
			<Main>
				
				<Form onSubmit={handleSubmit(this.onSubmit)}>
					<H1>Sign up</H1>
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
					{this.renderSuccess()}
					<Button>Sign Up!</Button>
					<Span>or</Span>
					<Link to="/signin">Sign In</Link>

					{this.props.errorMessage}
				</Form>

			</Main>
		)
	}
}

function mapeStateToProps(state) {
	return { errorMessage: state.auth.errorMessage,
	   successMessage: state.auth.successMessage,
	   auth: state.auth.authenticated
	 }
}

export default compose(
	connect(mapeStateToProps, actions),
	reduxForm({ form: 'signup' })
)(Signup);