import { AUTH_USER, AUTH_ERROR, AUTH_SUCCESS, WAITING_REPLY, SET_PASSWORD_FOR_EMAIL, MSG_GENERAL } from '../actions/types.js'

const INITIAL_STATE = {
    general: ''
}

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case MSG_GENERAL:
            return {...state, general: action.payload }
        default:
            return state;
    }

}