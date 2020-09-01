let defaultState = {
    data: null
}

const mainReducer = (state = defaultState, action) => {
    if(action.type==="SHOW_CART") {
        return {
            ...state,
            data: action.payload || defaultState.data
        }
    } else {
        return {
            ...state
        }
    }
}

export default mainReducer;