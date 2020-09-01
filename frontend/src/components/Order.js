import React, { Component } from 'react';
import requireAuth from './RequireAuth';
import {connect} from "react-redux"
import { Link } from 'react-router-dom';
import * as actionCreators from '../actions/index.js'
import CartItem from "./CartItem";
import Payment from "./Payment";


class Order extends Component {


    constructor(props) {

        super(props)



        console.log(`order id: ${props.match.params.id == undefined}`)
        if(props.match.params.id == undefined) {
            this.props.history.push('/account');
        }




        requireAuth(this)

        // this.props.loadCartPrivate(() => {
        // });

        this.props.getOrderDetails(props.match.params.id, () => {
            this.props.history.push('/account');
        });

        // this.props.getCard(() => {
        // });



    }

    componentDidMount() {
        // this.props.loadPortal()

    }

    componentDidUpdate(props) {
        console.log(props)
        // requireAuth(Portal)
    }

    refreshSession = () => {
        this.props.refreshSession(() => {

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
        var d = new Date(JSON.parse(date)),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }



    renderOrder = order => {
        if(!order) {
            return
        }

        // if(!order.items) {
        //     return
        // }

        // if (!subscription.orders ) {
        //     return(
        //         // return get started if no subscription active
        //
        //         <div className="account__subscription">
        //             <div className="account__subscription__items">
        //                 <div className="item">
        //                     <div className="img-wrap">
        //                         <Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" /></Link>
        //                     </div>
        //                     <div className="details">
        //                         <Link to={`/collection`}><button>Get Started</button></Link>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //
        //     )
        // }

        console.log(`order data -->: ${JSON.stringify(order)}`)

        //return

        //
        return (

            <div className="account__subscription">
                <div className="account__subscription__items">
                    {order.items.cartitems.map( (item, index) => (
                         <CartItem key={index} index={index} name={item.name} price={item.price} qty={item.qty} image={item.image} size={item.size}/>
                        // <div>
                        //     <p>Order Placed: {this.formatDate(JSON.parse(order.created))}</p>
                        //     <p>Total: ${order.items.total}</p>
                        //     <p>Status: {order.status}</p>
                        //     <Link to={`/order/${index}`}>Details</Link>
                        // </div>
                        // <p>{order.name}</p>

                    ))}

                </div>
                <div className="account__subscription__totals">
                	<p>Subtotal: ${order.items.subtotal}</p>
                	<p>Shipping: ${order.items.shipping}</p>
                	<p>Tax: -- </p>
                	<p>Total: ${order.items.total} </p>
                    <p>Order Placed: {this.formatDate(order.created)}</p>
                	<p>Status: {order.status}</p>
                </div>

                {/*<div className="item">*/}
                {/*    <div className="img-wrap">*/}
                {/*        <Link to={`/collection`}><img className="add-another" src="https://s3.amazonaws.com/clothoak.com/items/hdka1tg.jpg" /></Link>*/}
                {/*    </div>*/}
                {/*    <div className="details">*/}
                {/*        <Link to={`/collection`}><button>Add Another</button></Link>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>


        )
    }

    render() {
        return(

            <div className="account">
                <div className="account__details">
                    <h1>Order Details</h1>
                </div>

                { this.renderOrder(this.props.orderdetails) }


            </div>
        )
    }
}

const mapStateToProps=(state)=> {
    return {
        orderdetails : state.orderdetails.data,
        paymentMethod : state.payment.paymentMethod
    }

};

export default connect (mapStateToProps, actionCreators)(requireAuth(Order));
