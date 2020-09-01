import React, { Component } from 'react';
import requireAuth from './RequireAuth';
import {connect} from "react-redux"
import * as actionCreators from '../actions/index.js'
import Item from './Item'



class Portal extends Component {


constructor(props) {

	super(props)
	console.log(props)
	requireAuth(this)

}

componentDidMount() {
	// this.props.loadPortal()
}

componentDidUpdate(props) {
	
}

renderItems = items => {
	


	return (	
			<div className="itemsContainer">
			     <Item url={'/create'} text={'Create'} />

			</div>
		)
}
	render() {
			
		return(
			<div>
				{ this.renderItems() }
			</div>
		)
	}
}

const mapStateToProps=(state)=> {
	return {
		portal: null
	}

};

export default connect (mapStateToProps, actionCreators)(requireAuth(Portal));
