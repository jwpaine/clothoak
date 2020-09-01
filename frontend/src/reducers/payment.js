let defaultState = {
    payment : {},
    errorMessage : '',
    card : {}
}

const mainReducer = (state = defaultState, action) => {
    if(action.type==="STRIPE_SUCCESS") {
        return {
            ...state,
            payment: action.payment
        }
    } else if(action.type==="STRIPE_ERROR") {
        return {
            ...state,
            errorMessage: action.payload
        }
    } else if(action.type==="PAYMENT_METHOD") {

        return {
            ...state,
            paymentMethod: action.payload
        }

    } else {
        return {
            ...state
        }
    }
}

export default mainReducer;