import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import CartItem from './CartItem'
import styled from 'styled-components';
import PropTypes from 'prop-types'; // ES6
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'

import {Main, H1, Span, Button, P, A, CheckoutItem} from "../theme/elements"

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

                <>
                    <p><b>Subtotal</b>: ${cart["subtotal"]}</p>
                    <i>Tax and Shipping calculated at checkout</i>
                    {/*<p>Shipping: {cart.shipping}</p>*/}
                    {/*<p>Tax: {cart.tax}</p>*/}
                    {/*<p>Total: {cart.total}</p>*/}

                    <Button onClick={this.continueCheckout}>Checkout</Button>
                </>
            )
        }
    }

    renderCartHeading = cart => {
        if (!cart || cart.cartitems.length == 0) {
            return(
                <>
                    <H1>An empty cart</H1>
                    <H1> :( </H1> 
                </> 
            )
        }

        return(
            <H1>Things are looking up!</H1>
        )
    }

    renderCart = cart => {
        if(!cart) {console.log('not cart')
            console.log('not cart')
            return
        } 

        if (cart.cartitems.length > 0) {
            return (
                <>
                    {cart.cartitems.map( (item, index) => ( 
                        <CartItem key={index} index={index} removeItem={this.removeItem} item={item} />
                    ))}
                </>
            )
        }
        return (
            <CheckoutItem>
                <div className="img-wrap">
                    <Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/static/images/items/mask-black.jpg" /></Link>
                </div>
                <div className="details">
                    <Link to={`/collection`}><Button className="get-started">Get Started</Button></Link> 
                </div>
            </CheckoutItem>
        )
    }

    render() {

        const { handleSubmit } = this.props;

        const CartItems = styled.div`
            display: flex;
            flex-direction: column;
        `

        const CartTotals = styled.div`

        `
        return(
            <Main>
                <section>
                    {this.renderCartHeading(this.props.cart.data)}
                </section>
                <section>
                    <CartItems>
                        { this.renderCart(this.props.cart.data) }
                   
                    { this.renderCartCheckout(this.props.cart.data) }
                    </CartItems>
                </section>

            </Main>
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
