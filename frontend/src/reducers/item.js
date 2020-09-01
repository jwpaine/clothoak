let defaultState = {
	item : {},
	errorMessage : ''
}

const mainReducer = (state = defaultState, action) => {
	if(action.type==="SHOW_ITEM") {
		return {
			...state,
			item: action.item
		}
	} else if(action.type==="ADD_ERROR") {
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