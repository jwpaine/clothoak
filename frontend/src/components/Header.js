import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../actions'
import {compose} from "redux";


	const Wrapper = styled.section`

		background: lightgray;
		display: flex;
	    justify-content: flex-end;

	  	> .links {
	  		> a {
	  			padding: 5px;
	  		}
	  	}

	`;





class Header extends Component {

	// @TODO: create function renderItemCount() which uses subscription data from redux (would have been updated by other components, otherwise show 0 if data doesn't exist)
	constructor(props) {
		super(props)
		//
		if (this.props.authenticated) {
			this.props.loadCartPrivate(() => {
			});
		} else {
			this.props.loadCart(() => {
			});
		}

	}

	componentDidMount() {

	}

	countCartItems(cart) {

		if (!cart) {
			console.log('no cart items found')
			return 0
		}



		// console.log(`counting cart items: ${JSON.stringify(cartitems)}`)
		//
		// return
 
		let qty = cart.cartitems.reduce((a,b) => a + parseInt(b.qty), 0)

		if (qty > 99) return '99+' 

		return qty  

		//return cart.cartitems.length
	}

	renderLinks(cartItems) {

	    if (this.props.authenticated) {

			return (
				<div className="links">
					<Link to={`/signout`}>Sign out</Link>
					<Link to="/account">My Account</Link>
					<Link className="links__mini-cart" to="/cart">
						<div className="quantity">{cartItems}</div>  
					</Link>
				</div>
			)

		}

		return (
				<div className="links">
					<Link to="/signin">Sign in</Link>
					<Link className="links__mini-cart" to="/cart">
						{/* <img src='https://s3.amazonaws.com/clothoak.com/static/images/icons/shopping_basket.svg'/>  */} 
						<div className="quantity">{cartItems}</div> 
					</Link>

				</div>
		)
	}
	render() {
		return (
			<header>

				<div className="wrap">

					<Link className="logo" to="/">
						ClothoaK
					</Link>

					{ this.renderLinks(this.countCartItems(this.props.cart.data)) }

				</div>


			</header>
		)
	}
}

function mapStateToProps(state, props) {
	return {

		authenticated: state.auth.authenticated,
		cart : state.cart

	}
}



export default compose(
	connect(mapStateToProps, actions)
)(Header);

// export default connect(mapStateToProps)(Header);