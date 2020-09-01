let defaultState = {
    data: null
}

const mainReducer = (state = defaultState, action) => {
    console.log(`customer reduced ---> ${JSON.stringify(action.payload)}`)
    if(action.type==="SHOW_CUSTOMER") {
        return {
            ...state,
            data: action.payload || defaultState.data
        }
    } else if(action.type==="GET_SHIPPING") {
        return {
            ...state,
            data: action.payload || defaultState.data
        }
    } else if(action.type==="SHOW_ORDER") {
            return {
                ...state,
                order: action.payload || defaultState.data
            }
    } else {
        return {
            ...state
        }
    }
}

export default mainReducer;
