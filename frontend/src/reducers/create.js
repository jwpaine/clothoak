import { CREATE_ERROR } from '../actions/types';

const INITIAL_STATE = {
	errorMessage : []
}



export default function(state = INITIAL_STATE, action) {


	switch(action.type) {
		case CREATE_ERROR:
			return {...state, errorMessage: action.payload }
		default:
			return state;
	}

}