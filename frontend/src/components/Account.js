import React, { Component } from 'react';
import requireAuth from './RequireAuth';
import {connect} from "react-redux"
import { Link } from 'react-router-dom';
import * as actionCreators from '../actions/index.js'
import CartItem from "./CartItem";
import Payment from "./Payment";


class Portal extends Component {


constructor(props) {

	super(props)
	console.log(props)
	requireAuth(this)

	// this.props.loadCartPrivate(() => {
	// });

	this.props.loadCustomer(() => {
	});

	// this.props.getCard(() => {
	// });



}

componentDidMount() {
	// this.props.loadPortal()
}

componentDidUpdate(props) {
	console.log(props)
	requireAuth(Portal)
}

 refreshSession = () => {
		this.props.refreshSession(() => {
            window.location.reload();
		})
	}

removeItem = (index) => {
	this.refreshSession()
	this.props.removeSubscriptionItem({"index" : index}, () => {
	});
}

updateCard = (token) =>  {
	this.refreshSession()
	this.props.updateCard(token,  () => {

	});
}

renderPaymentMethod = card_details => {
	if (!card_details) {
		return
	}

	return(
		<div className="account__subscription__payment">
			<label>Payment Method</label>
			<p> {card_details.name}</p> 
			<p>**** {card_details.last_4}</p>
			<Payment update={'yes'} handleToken={this.updateCard.bind(this)} />
		</div>
	)
}

cancelSubscription = () => {
	this.refreshSession()
	this.props.cancelSubscription(function(r) {

	})
}

formatDate = (date) => {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [year, month, day].join('-');
	}



renderOrders= customer => {
		if(!customer) {
			console.log('!customer')
			return
		}

		if (!customer.orders ) {
			return(
				// return get started if no subscription active

					<div className="account__subscription">
						<div className="account__subscription__items">
							<div className="item">
								<div className="img-wrap">
									<Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" /></Link>
								</div>
								<div className="details">
									<Link to={`/collection`}><button>Get Started</button></Link>
								</div>
							</div>
						</div>
					</div>

			)
		}

		console.log(`customer -->: ${customer}`)

		return (

				<div className="account__subscription">
					<div className="account__subscription__items">
						{customer.orders.map( (order, index) => (
							// <CartItem removeItem={this.removeItem} key={index} index={index} name={item.name} price={item.price} qty={item.qty} image={item.image} size={item.size}/>
							<div key={index}>
								<p>Order Placed: {this.formatDate(JSON.parse(order.created))}</p>
								<p>Status: {order.status}</p>
								<Link to={`/order/${index}`}>Details</Link>
							</div>
						))}
						<div className="item">
							<div className="img-wrap">
								<Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" /></Link>
							</div>
							<div className="details">
								<Link to={`/collection`}><button>Add Another</button></Link>
							</div>
						</div>
					</div>
					{/*<div className="account__subscription__totals">*/}
					{/*	<p>Subtotal: ${subscription.active.subtotal}</p>*/}
					{/*	/!*@TODO don't calculate shipping/tax if no items present.*!/*/}
					{/*	<p>Shipping: ${subscription.active.shipping}</p>*/}
					{/*	<p>Tax: -- </p>*/}
					{/*	<p>Total: ${subscription.active.total} </p>*/}
					{/*	<p>Next shipment: n days </p>*/}

					{/*	/!*@TODO: implement pause functionality*!/*/}
					{/*</div>*/}

					{/*{this.renderPaymentMethod(this.props.paymentMethod)}*/}

					{/*<button onClick={this.cancelSubscription}>Cancel Subscription</button>*/}





				</div>


		)
	}

	render() {
		return(

			<div className="account">
				<div className="account__details">
					<h1>My Orders</h1>
				</div>

				{ this.renderOrders(this.props.customer.data) }

			</div>
		)
	}
}

const mapStateToProps=(state)=> {
	return {
		customer: state.customer,
		paymentMethod : state.payment.paymentMethod
	}

};

export default connect (mapStateToProps, actionCreators)(requireAuth(Portal));
