import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth'
import create from './create'
import item from './item'
import cart from './cart'
import customer from './customer'
import payment from './payment'
import orderdetails from './orderdetails'
import  messages from './messages'

export default combineReducers({
	auth,
	create, 
  	form: formReducer,
  	item,
	cart,
	customer,
	payment,
	messages,
	orderdetails

});
