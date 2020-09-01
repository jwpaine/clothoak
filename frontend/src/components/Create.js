import React, { Component } from 'react';
import requireAuth from './RequireAuth';
import {connect} from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from 'prop-types'; // ES6
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'

import Item from './Item'


class Manage extends Component {


constructor(props) {
	super(props)

	
	requireAuth(this)
	

}

static contextTypes = {
    router: PropTypes.object
}


componentDidMount() {
	//this.props.loadPlace()
}

componentDidUpdate(props) {

	

}

static contextTypes = {
    router: PropTypes.object
}
 
createItem = formProps => {
    this.props.createItem(formProps, () => {
        console.log('created! Lets redirect...')
    });
};




	render() {

		const { handleSubmit } = this.props;


		return(
			<div>
                <Link to={`/portal`}>Back</Link>
				<h1>Create Item</h1>
				<form onSubmit={handleSubmit(this.createItem)}>
					<fieldset>

						<Field
							name="item"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="What are you selling?"
						/>
						<Field
							name="price"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="Price"
						/>
						<Field
							name="zip"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="Zip Code"
						/>
						<Field
							name="desc"
							type="text"
							component="input"
							autoComplete="none"
							placeholder="Description"
						/>
						
					</fieldset>
					
					<div>{this.props.errorMessage} </div>
					
					<button>Create!</button>
				</form>
			</div>
		)
	}
}

function mapeStateToProps(state, props) {

	return { 
		errorMessage: state.create.errorMessage
	}
}

export default compose(
	connect(mapeStateToProps, actions),
	reduxForm({ form: 'createItem', enableReinitialize : true})
)(requireAuth(Manage));
