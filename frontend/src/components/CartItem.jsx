import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";

import {Main, H1, Span, Button, P, A, CheckoutItem} from "../theme/elements"


const renderDelete = (removeItem, index) => {
    if (removeItem) {
        return (
            <A href="#" onClick={() => removeItem(index)}>Remove</A>
        )
    }
}

const renderItemOptions = item => {
    return 
}

const renderItemDetails = item => {
    if (!item) return

    return (
        <>
            {Object.keys(item).map(attribute => 
                { if (attribute != 'name' && attribute != 'qty' && attribute != 'price' && attribute != 'image') {
                    return (
                        <Span>
                            {attribute + ": " + item[attribute] + "\n"}
                        </Span>
                        )
                    }
                }
            )}
        </>
    )
}
const CartItem = (props) => {

    return(
        <CheckoutItem>
            <Link to={`/item/${props.item.name}`}>
                <img src={`${props.item.image}`} />
            </Link>
            <div className="details">
                <Link to={`/item/${props.item.name}`}><b>{props.item.name}</b></Link>
                {renderItemDetails(props.item)}
                <Span>Qty: {props.item.qty} </Span>
                <Span>${props.item.price} </Span>

                { renderDelete(props.removeItem, props.index) }
            </div>
        </CheckoutItem>
    )
}
export default CartItem;

