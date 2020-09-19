import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import CartItem from './CartItem'

import PropTypes from 'prop-types'; // ES6
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'



class Cart extends Component {


    constructor(props) {
        super(props)

        if (this.props.authenticated) {
            this.props.loadCartPrivate(() => {
            });
        } else {
            this.props.loadCart(() => {
            });
        }

    }

    static contextTypes = {
        router: PropTypes.object
    }


    componentDidMount() {

    }

    componentDidUpdate(props) {

    }


    static contextTypes = {
        router: PropTypes.object
    }

    refreshSession = () => {
        this.props.refreshSession(() => {

        })
    }

    removeItem = (index) => {
        if (this.props.authenticated) {
            this.refreshSession()
            this.props.deleteCartItemPrivate({"index" : index}, () => {
            });
        } else {
            this.props.deleteCartItem({"index" : index}, () => {
            });
        }

    }

    continueCheckout = () => {
        if (this.props.authenticated) {
            this.props.history.push('/checkout');
            return
        }

        this.props.history.push('/guest');

    }

    renderCartCheckout = cart => {

        if (!cart) {
            return
        }

        if (cart.cartitems.length > 0) {
            return (

                <div className="cart__checkout__totals">
                    <p><b>Subtotal</b>: ${cart["subtotal"]}</p>
                    <i>Tax and Shipping calculated at checkout</i>
                    {/*<p>Shipping: {cart.shipping}</p>*/}
                    {/*<p>Tax: {cart.tax}</p>*/}
                    {/*<p>Total: {cart.total}</p>*/}

                    <button onClick={this.continueCheckout}>Checkout</button>
                </div>
            )
        }
    }

    renderCartHeading = cart => {
        if (!cart || cart.cartitems.length == 0) {
            return(
                <div>
                    <h1>An empty cart</h1>
                    <h1> :( </h1> 
                </div> 
            )
        }

        return(
            <h1>Things are looking up!</h1>
        )
    }

    renderCart = cart => {
        if(!cart) {console.log('not cart')
            console.log('not cart')
            return (
                <div className="item">
                    <div className="img-wrap">
                        <Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/static/images/items/mask-black.jpg" /></Link>
                    </div>
                    <div className="details">
                        <Link to={`/collection`}><button className="get-started">Get Started</button></Link>
                    </div>
                </div>
            )
        } 

       

        if (cart.cartitems.length > 0) {
            return (
                <div>
                    {cart.cartitems.map( (item, index) => (
                        
                        <CartItem key={index} index={index} removeItem={this.removeItem} item={item} name={item.name} qty={item.qty} price={item.price} image={item.image} color={item.color}/>
                    ))}
                </div>
            )
        }
        return (
            <div className="item">
                <div className="img-wrap">
                    <Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/static/images/items/mask-black.jpg" /></Link>
                </div>
                <div className="details">
                    <Link to={`/collection`}><button className="get-started">Get Started</button></Link> 
                </div>
            </div>
        )
    }

    render() {

        const { handleSubmit } = this.props;
        return(
            <div className="cart">
                <div className="cart__hero">
                    {this.renderCartHeading(this.props.cart.data)}
                </div>
                <div className="cart__checkout">
                    { this.renderCart(this.props.cart.data) }
                    { this.renderCartCheckout(this.props.cart.data) }
                </div>

            </div>
        )
    }
}

function mapStateToProps(state, props) {

    console.log(state)
    return {
        errorMessage: state.create.errorMessage,
        cart : state.cart,
        authenticated: state.auth.authenticated

    }
}

export default compose(
    connect(mapStateToProps, actions)
)(Cart);
