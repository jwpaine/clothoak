import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import StripeCheckout from "react-stripe-checkout";

import {connect} from "react-redux";
import { compose } from 'redux'



class Payment extends Component {

    constructor(props) {
        super(props);

        // if(props.preFill) {
        //
        //     this.props.change("name", props.preFill.name)
        //     this.props.change("address", props.preFill.address)
        //     this.props.change("city", props.preFill.city)
        //     this.props.change("state", props.preFill.state)
        //     this.props.change("zip", props.preFill.zip)
        //
        // }

    }

    payment = (update, chargeAmount, handleToken) => {

        const stripe_key = "pk_test_mfTHfWkCwfhE6jZ7VzyxYfML00l6sLub9P"

        if(!handleToken) {
            return
        }

        // if user wants to update payment method
        if (update) {
            return(
                <StripeCheckout
                    token={handleToken}
                    stripeKey={stripe_key}
                    name="Clothoak.com"
                    panelLabel="Update Card Details"
                    label="Update Card Details"
                    allow-remember-me='false'
                    locale="auto"
                />
            )
        }

        // otherwise, charge for amount
        return(
            <StripeCheckout
                token={handleToken}
                stripeKey="pk_test_mfTHfWkCwfhE6jZ7VzyxYfML00l6sLub9P"
                amount={chargeAmount* 100}
                name="Clothoak.com"
                // billingAddress="true"
            />
        )



    }



    render() {
        return (
           <div>
               {this.payment(this.props.update, this.props.chargeAmount, this.props.handleToken)}
           </div>
        )
    }

}

const mapStateToProps = (state, props) => {
    return {

        // other props...
    }
}

// export default reduxForm({
//    // form: 'myForm'
// })(Address)

export default compose(
    connect(mapStateToProps)

)(Payment);



