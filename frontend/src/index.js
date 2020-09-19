import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'
import App from './components/App';
import reducers from './reducers';

import Welcome from './components/Welcome';
import Portal from './components/Portal';
import Account from './components/Account';

import Signup from './components/auth/Signup'
import Signin from './components/auth/Signin'
import Signout from './components/auth/Signout'
import ForgetPassword from './components/auth/ForgetPassword'
import ResetPassword from './components/auth/ResetPassword'

import Create from './components/Create'
import Item from './components/Item'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import GuestCheckout from './components/GuestCheckout'
import Collection from './components/Collection'
import Order from './components/Order'

import Landing from './components/Landing';

 
 

 
const store = createStore(reducers,{
	auth: { authenticated: localStorage.getItem('token') }
}, applyMiddleware(reduxThunk))

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App >
				
				{/* <Route path="/" exact component={Landing} /> */}
				 
				<Route path="/" exact component={Welcome} />
				<Route path="/signup" component={Signup} />
				<Route path="/signin" component={Signin} />
				<Route path="/signout" component={Signout} />
				<Route path="/forgot" component={ForgetPassword} />
				<Route path="/reset/:email" component={ResetPassword} />

				<Route path="/portal" component={Portal} />
				<Route path="/account" component={Account} />
				<Route path="/create" component={Create} />
				<Route path="/cart" component={Cart} />
				<Route path="/checkout" component={Checkout} />
				<Route path="/guest" component={GuestCheckout} /> 
				
				<Route path="/collection" component={Collection} />

				<Switch>
					<Route path="/order/:id" component={Order} />
					<Route path="/order/" component={Order} />
				</Switch>
				
				<Switch>
					<Route path="/item/:name" component={Item} />
				</Switch> 

			</App >
		</BrowserRouter>
	</Provider>,
	document.querySelector('#root')
)

