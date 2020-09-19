import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";

import StripeCheckout from "react-stripe-checkout";

import CartItem from './CartItem'

import PropTypes from 'prop-types'; // ES6 
import { compose } from 'redux'

import * as actionCreators from '../actions/index.js'
import * as actions from '../actions'
import requireAuth from "./RequireAuth";

import { reduxForm, Field, FormName, submit, handleSubmit } from 'redux-form'

import CCForm from './CCForm'

import Address from "./Address";


class GuestCheckout extends Component {

    constructor(props) {
        super(props)

    }

    static contextTypes = {
        router: PropTypes.object
    }


    componentDidMount() {
    //    if (!this.props.authenticated) {
    //         this.props.history.push('/signin?next=cart');
    //         return
    //     }

        this.props.loadGuest(() => {
         
            
        });

        // this.props.getShippingAddress(() => {
        // });
    }

    componentDidUpdate(props) {

    }


    static contextTypes = {
        router: PropTypes.object
    }

    removeItem = (index) => {
        if (this.props.authenticated) {
            this.props.deleteCartItemPrivate({"index" : index}, () => {
            });
        } else {
            this.props.deleteCartItem({"index" : index}, () => {
            });
        }

    }

    // renderSubscription = subscription => {
    //     if(!subscription) {
    //         return
    //     }
    //
    //     if (!subscription.active || subscription.active.length == 0) {
    //         return(
    //             <div>
    //                 {/*<p>The following items will be added to your subscription</p>*/}
    //             </div>
    //         )
    //     }
    //    // console.log(`active subscription: ${JSON.stringify(subscription.active)}`)
    //
    //     {/*<div className="subscription">*/}
    //     {/*    <h1>Subscription Found</h1>*/}
    //     {/*    {subscription.active.map( (item, index) => (*/}
    //     {/*        <CartItem key={index} index={index} name={item.name} price={item.price} image={item.image} size={item.size}/>*/}
    //     {/*    ))}*/}
    //     {/*</div>*/}
    //
    //     return (
    //
    //
    //         <div>
    //             <p>The following items will be added to your monthly <Link to={`/account`}>subscription</Link></p>
    //         </div>
    //
    //     )
    // }

    refreshSession = () => {
        this.props.refreshSession(() => {

        })
    }

   updateGuest = formProps => { 
      //  this.refreshSession()
        this.props.updateGuest(formProps, () => {
        });
    };
    updateBillingAddress = formProps => {
        this.refreshSession()
        this.props.updateBillingAddress(formProps, () => {
        });
    };
    updateCustomer = () => {
        this.refreshSession()
        this.props.mergeCartWithActive(() => {
            this.props.history.push('/account');
        });
    }

    renderCartItems = cart => {

        if(!cart) {
            return
        }

        if (!cart.cartitems) {
            return
        }





        if (cart.cartitems.length == 0) {
            this.props.history.push('/cart');
            return
        }

        console.log(`received cart--${JSON.stringify(cart)}`)

        return (
            <div className="checkout__items">
                {cart.cartitems.map( (item, index) => (
                    <CartItem key={index} index={index} name={item.name} price={item.price} qty={item.qty} image={item.image} size={item.size}/>
                ))}
                <div className="checkout__totals">
                    <p><b>Subtotal</b>: ${cart.subtotal}</p>
                    <p><b>Shipping</b>: ${cart.shipping}</p>
                    <p><b>Tax</b>: -- </p>
                    <p><b>Order Total</b>: ${cart.total}</p>
                </div>
            </div>
        )
    }

    renderSubmitButtons = (customer, cart) => {

        if(!cart) {
            console.log('not cart')
            return
        }

        if(customer) {
            let shipping = customer.shipping
            console.log(`customer --> ${JSON.stringify(customer)}`)
          
            if (!shipping) {

                    return(
                        <div>
                            <p>Please supply shipping address</p>
                        </div>
                    )
            } 

            if(shipping && !shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.zip || !shipping.email) {
                return(
                    <div>
                        <p>Please supply full shipping address</p>
                    </div>
                )
            }

          //  return
        }

            return (
                <StripeCheckout
                    token={this.handleToken}
                    stripeKey="pk_test_mfTHfWkCwfhE6jZ7VzyxYfML00l6sLub9P"
                    amount={cart.total* 100}
                    name="Clothoak.com"
                    // billingAddress="true"
                />
            )

    }

    renderShipping = data => {
        if (!data) {
            console.log('not shipping')
            return;
        }

       console.log(`guest data received: ${JSON.stringify(data)}`)  

     
        return (
            <div> 
                <h1>Where should we send it?</h1> 
                <p>Already have an account? <Link to={`/signin`}>signin</Link></p>  
                <Address name="shippingAddress" guest={true} preFill={data} onSubmit={this.updateGuest.bind(this)}/>
               
            </div> 
        )
    }

    renderBilling = data => {
        if (!data) {
            console.log('not shipping')
            return;
        }

        let billing = data.billing
        return (
            <div className="billing">
                <label>Billing Address:</label>
                <Address name="billingAddress"  preFill={billing} onSubmit={this.updateBillingAddress.bind(this)}/>
            </div>
        )
    }

    handleToken = (token, addresses) =>  {
        console.log({token, addresses})

        this.props.submitPayment(token,  () => {

            this.props.history.push('/account');

        });
    }



    render() {

       // const { handleSubmit } = this.props;

        return(
            <div className="checkout">

                <div className="checkout__address">
                    { this.renderShipping(this.props.customer.data) }
                    {/*{ this.renderBilling(this.props.subscription.data) }*/}
                </div>

                <div className="checkout__details">
                    {/*{ this.renderSubscription(this.props.subscription.data, this.props.cart.data) }*/}
                    { this.renderCartItems(this.props.cart.data)}
                    { this.renderSubmitButtons(this.props.customer.data, this.props.cart.data) }

                </div>





                {/*<label>Billing: </label>*/}
                {/*<Address formId="billing" fieldNames={{'name' : 'billingName', 'address' : 'billingAddress'}} onSubmit={this.updateBillingAddress.bind(this)}/>*/}
    


            </ div>
        )
    }
}

function mapStateToProps(state, props) {


    return {
        errorMessage: state.create.errorMessage,
        cart : state.cart,
        authenticated: state.auth.authenticated,
        customer: state.customer,
        payment: state.payment
    }
}

export default compose(
    connect(mapStateToProps, actions)
)(GuestCheckout); 





