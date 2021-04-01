let defaultState = {
    data: null
}

const mainReducer = (state = defaultState, action) => {
    console.log(`action type --> ${action.type}`)
    if(action.type==="SHOW_CUSTOMER") {
        console.log('show')
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
    } else if (action.type==="ADD_ERROR") {
        console.log('add error!')
		return {
			...state,
			errorMessage: action.payload
		}
    } else {
        return {
            ...state
        }
    }
}

export default mainReducer;
