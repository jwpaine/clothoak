let defaultState = {
    data: null
}

const mainReducer = (state = defaultState, action) => {
    // console.log(`---> ${JSON.stringify(action.payload)}`)
    if(action.type==="SHOW_ORDER") {
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
