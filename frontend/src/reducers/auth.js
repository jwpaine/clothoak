import { AUTH_USER, AUTH_ERROR, AUTH_SUCCESS, WAITING_REPLY, SET_PASSWORD_FOR_EMAIL } from '../actions/types.js'

const INITIAL_STATE = {
	authenticated: '',
	errorMessage: '',
	successMessage: '',
	unVerified: '',
	waitingReply: ''
}

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case AUTH_USER:
			return {...state, authenticated: action.payload }
		case AUTH_ERROR:
			return {...state, waitingReply: false, unVerified: action.unVerified, errorMessage: action.payload}
		case AUTH_SUCCESS: 
		    return {...state, waitingReply: false, successMessage: action.payload}
		case SET_PASSWORD_FOR_EMAIL:
			return {...state, setPasswordForEmail: action.payload}
		case WAITING_REPLY:
			return {...state, waitingReply: true}
		default:
			return state;
	}

}