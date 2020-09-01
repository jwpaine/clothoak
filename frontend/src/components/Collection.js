import React, { Component } from 'react';
import requireAuth from './RequireAuth';
import {connect} from "react-redux"
import { Link } from 'react-router-dom';
import * as actionCreators from '../actions/index.js'
import CartItem from "./CartItem";


class Collection extends Component {


constructor(props) {

	super(props)

}



renderSubscription = subscription => {
		if(!subscription) {
			return
		}

		if (!subscription.active || subscription.active.items.length == 0 ) {
			return(
				// return get started if no subscription active
				<div className="account">
					<div className="account__details">
						<h1>My Subscription</h1>
					</div>
					<div className="account__subscription">
						<div className="account__subscription__items">
							<div className="item">
								<div className="img-wrap">
									<a href="/item/tshirt-crew"><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" />
									</a>
								</div>
								<div className="details">
									<button>Get Started</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}

		console.log(`length of subscription: ${subscription.active.length}`)

		return (
			<div className="account">
				<div className="account__details">
					<h1>My Subscription</h1>
				</div>
				<div className="account__subscription">
					<div className="account__subscription__items">
						{subscription.active.items.map( (item, index) => (
							<CartItem removeItem={this.removeItem} key={index} index={index} name={item.name} price={item.price} image={item.image} size={item.size}/>
						))}
						<div className="item">
							<div className="img-wrap">
								<a href="/item/tshirt-crew"><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" />
								</a>
							</div>
							<div className="details">
								<button>Add Another</button>
							</div>
						</div>
					</div>
					<div className="account__subscription__totals">
						<p>Subtotal: {subscription.active.subtotal}</p>
						{/*@TODO don't calculate shipping/tax if no items present.*/}
						<p>Shipping: {subscription.active.shipping}</p>
						<p>Tax: {subscription.active.tax}</p>
						<p>Total: {subscription.active.total} </p>
						<p>Next shipment: n days </p>
						<a href="#">Pause Subscription</a>
						{/*@TODO: implement pause functionality*/}
					</div>
				</div>
			</div>

		)
	}



	render() {
		return(
			<div className="collection">

					<div className="collection__details">
						<h1>Choose A Style</h1>
					</div>
					<div className="collection__items">
						<div className="tees">
							<div className="item">
								<div className="img-wrap">
									<a href="/item/mask"><img src="https://s3.amazonaws.com/clothoak.com/static/images/items/mask-black.jpg" />
									</a>
								</div>
								<div className="details">
									<strong>4-layer Face Mask - $5</strong>
                                    <p>Stitched with cotton, non-woven, and melt-blown fabrics.</p>
								</div>
							</div>
							
						</div>
						{/* <div className="vees">
							<div className="item">
								<div className="img-wrap">
									<a href="/item/v-neck-plain"><img src="https://s3.amazonaws.com/clothoak.com/items/fh37fgsjtet.jpg" />
									</a>
								</div>
								<div className="details">
									<strong>Clean Oceans V-Neck $21</strong>
                                    <p>Support Ocean Cleanup</p>
                                </div>
							</div>
							<div className="item">
								<div className="img-wrap">
									<a href="/item/v-neck-plain"><img src="https://s3.amazonaws.com/clothoak.com/items/fh37fgsjtet.jpg" />
									</a>
								</div>
								<div className="details">
									<strong>Plant Trees V-Neck $21</strong>
                                    <p>Support Reforestation</p>
                                </div>
							</div>
						</div> */}


					</div>

			</div>
		)
	}
}

const mapStateToProps=(state)=> {
	return {

	}

};

export default connect (mapStateToProps, actionCreators)(Collection);
