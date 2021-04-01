import axios from 'axios'


import {
	AUTH_USER,
	AUTH_ERROR,
	ADD_ERROR,
	CREATE_ERROR,
	AUTH_SUCCESS,
	WAITING_REPLY,
	SET_PASSWORD_FOR_EMAIL, MSG_GENERAL
} from './types';

import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoRefreshToken , AmazonCognitoIdentity, InitiateAuth} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk' 

	var poolData = {
        UserPoolId : 'us-east-1_WA7fa9Lcs', // Your user pool id here
        ClientId : 'c48dleoeu3169pskscunr6uv9' // Your client id here
    };

var cognitoUserr;

let api_url = 'http://localhost:8080'   
// let api_url = 'https://api.clothoak.com'  

export const signup = (formProps, callback) => async dispatch => {

	console.log(formProps)

	dispatch({type: AUTH_ERROR, payload: "" })

	if (!formProps.email) {
		dispatch({type: AUTH_ERROR, payload: "Please enter email" })
		return
	}

	if (!formProps.password) {
		dispatch({type: AUTH_ERROR, payload: "Please enter password" })
		return
	}

	let email = formProps.email.toLowerCase()
	let password = formProps.password

    var userPool = new CognitoUserPool(poolData);
    var attributeList = [];

    userPool.signUp(email, password, attributeList, null, function(err, result){
        if (err) {
        	if (JSON.stringify(err.message).indexOf('failed to satisfy constraint') != -1) {
        		 dispatch({type: AUTH_ERROR, payload: 'Password does not meet minimum requirements'})
        		 return
        	}
        	if (JSON.stringify(err.message).indexOf('email already exists') != -1) {
        		 dispatch({type: AUTH_ERROR, payload: err.message })
        		 return
        	}

        	dispatch({type: AUTH_ERROR, payload: err.message })
        }
            dispatch({type: AUTH_SUCCESS, payload: result })
    });

};

export const resetPassword = (formProps, callback) => async dispatch => {
	console.log(`resetting password for account: ${JSON.stringify(formProps)}`)
	if (!formProps.email) {
		dispatch({type: AUTH_ERROR, payload: 'Please enter email' })
		return
	}

	var userPool = new CognitoUserPool(poolData);

	var userData = {
		Username : formProps.email.toLowerCase(),
		Pool : userPool
	};
	var cognitoUser = new CognitoUser(userData);


	cognitoUser.forgotPassword({
		onSuccess: function (result) {
			dispatch({type: SET_PASSWORD_FOR_EMAIL, payload: formProps.email.toLowerCase() })
			callback()
		},
		onFailure: function (err) {
			if(err.name == "UserNotFoundException") {
				dispatch({type: AUTH_ERROR, payload: "No such Email" })
			} else {
				dispatch({type: AUTH_ERROR, payload: "An error occurred. Please try again" })
			}
		}
	})
		// },
		// inputVerificationCode() {
		// 	var verificationCode = prompt('Please input verification code ' ,'');
		// 	var newPassword = prompt('Enter new password ' ,'');
		// 	cognitoUser.confirmPassword(verificationCode, newPassword, this);
		// }
}

export const verifyCode = (formProps, callback) => async dispatch => {
	console.log(`verifying code: ${JSON.stringify(formProps)}`)

	if (!formProps.code) {
		dispatch({type: AUTH_ERROR, payload: 'Please enter code' })
		return
	}

	var userPool = new CognitoUserPool(poolData);

	var userData = {
		Username : formProps.email.toLowerCase(),
		Pool : userPool
	};
	var cognitoUser = new CognitoUser(userData);

	 	cognitoUser.confirmPassword(formProps.code, formProps.password, {
	 			// console.log('bad!!')
				// dispatch({type: SET_PASSWORD_FOR_EMAIL, payload: '' })
				// dispatch({type: AUTH_ERROR, payload: JSON.stringify(err) })
				// return
			onSuccess: function (result) {
				console.log('success')
				dispatch({type: MSG_GENERAL, payload: `Password Reset for ${formProps.email.toLowerCase()}` })
				callback()
			},
			onFailure: function (err) {
				if(err.name == "CodeMismatchException") {
					dispatch({type: AUTH_ERROR, payload: "Invalid Code. Please try again." })
				} else {
					dispatch({type: AUTH_ERROR, payload: "An error occurred. Please try again" })
				}

				dispatch({type: SET_PASSWORD_FOR_EMAIL, payload: '' })

			}

		});

}

export const signin = (formProps, callback) => async dispatch => {


	if (!formProps.email || !formProps.password ) {
		dispatch({type: AUTH_ERROR, payload: 'Please enter email and password' })
		return
	}

	dispatch({ type: WAITING_REPLY })
	dispatch({type: MSG_GENERAL, payload: '' })

	var authenticationData = {
        Email : formProps.email.toLowerCase(),
        Password : formProps.password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userPool = new CognitoUserPool(poolData);
    var userData = {
        Username : formProps.email.toLowerCase(),
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
        	console.log('You are now logged in.');
            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            var idToken = result.idToken.jwtToken;
          //  console.log('idToken: ' + idToken)
	  		localStorage.setItem('token', idToken)
			// update tokenCreated time
			localStorage.setItem('tokenCreated', new Date())

			localStorage.setItem('refreshToken', result.getRefreshToken().getToken())







			dispatch({ type: AUTH_USER, payload: idToken })
			callback();
        },

        onFailure: function(err) {
        	console.log(JSON.stringify(err.message))
            if (JSON.stringify(err.message).indexOf('Incorrect') != -1) {
        		 dispatch({type: AUTH_ERROR, payload: err.message})
        		 return
        	}
        	if (JSON.stringify(err.message).indexOf('does not exist') != -1) {
        		 dispatch({type: AUTH_ERROR, payload: err.message})
        		 return
        	}
        	if (JSON.stringify(err.message).indexOf('not confirmed') != -1) {
        		 dispatch({type: AUTH_ERROR, unVerified: formProps.email, payload: err.message})
        		 return
        	}

        	// default
        	dispatch({type: AUTH_ERROR, payload: 'An error occured. Please try again.' })
        },

    });
};

export const refreshSession = (callback) => async dispatch => {

	let tokenCreated = localStorage.getItem('tokenCreated')

	let tokenAge = Math.floor((Math.abs(new Date(localStorage.getItem('tokenCreated')) - new Date())/1000)/60);

	console.log(`token age: ${tokenAge}`)

	if(tokenAge >= 60) {
		alert('refreshing token!')

		var userPool = new CognitoUserPool(poolData);

		var cognitoUser = userPool.getCurrentUser();

		let token = new CognitoRefreshToken({RefreshToken: localStorage.getItem('refreshToken')})


		cognitoUser.refreshSession(token, (err, session) => {
			if (err) {console.log(`Token age (minutes): ${tokenAge}`)
				console.log(err)
				return
			}
			// save token to local storage
			let idToken = session.idToken.jwtToken;
			localStorage.setItem('token', idToken)
			// update tokenCreated
			localStorage.setItem('tokenCreated', new Date())

			console.log('Refreshed Successfully')
		})

        callback()

	}



	return

}

const refreshSessionLocal = (callback) => {
	console.log(`checking for refresh!`)
	callback()
}

export const resendVerification = (email, callback) => async dispatch => {

	dispatch({type: AUTH_ERROR, payload: "" })
	dispatch({type: AUTH_SUCCESS, payload: "" })


	console.log('resending verification for: ' + email)
	let data = {
    		email: email
		}

		var userPool = new CognitoUserPool(poolData);

		// var cognitoUser = userPool.getCurrentUser();

		const userData = {
			Username: email,
			Pool: userPool
		};
	
		let cognitoUser = new CognitoUser(userData);
		
		cognitoUser.resendConfirmationCode((err, result) => {
            if (err) {
                console.log(err);
				dispatch({type: AUTH_ERROR, payload: err.message})
            } else {
				console.log('success!');
				console.log(`--> result: ${result}`)
				dispatch({type: AUTH_SUCCESS, payload: 'Confirmation Email sent.'})
            }
        });
};

export const signout = (callback) => async dispatch => {

	localStorage.removeItem('cartid');
	localStorage.removeItem('token');

	dispatch({type : "SHOW_CART", cart: []})
	dispatch({ type: AUTH_USER, payload: '' })

// 	return {
// 		type: AUTH_USER,
// 		payload: ''
// 	}
	callback()
}

export const isSignedIn = (callback) => async dispatch => {



}

export const createItem = (formProps, callback) => async dispatch => {
	console.log(`creating item: ${JSON.stringify(formProps)} -->`)
		let headers = {
    		"headers": {
    			"Authorization" : localStorage.getItem('token'),
    			'Content-Type': 'application/json'
    		},
    	}
		const response = await axios.post('https://api.swaplily.com/item', formProps, headers ).then((response)=>{
			callback()
		}).catch(function (error) {
			dispatch({type: CREATE_ERROR, payload: "An error occured. Please try again." })
  	});
};

export const addItem = (formProps, item, callback) => async dispatch => {

	/* error handling */
	let messages = []

	// if (!formProps.size) {
	// 	messages.push({text: 'Please select size option', key: 'size'})
	// }
	
	if (item.options) {
		Object.keys(item.options).map(type => {
					
			if(!formProps[type]) {
				messages.push({text: `Please select ${type} option`, key: type})
			}
		
		})
	}

	if (formProps.qty.trim() == "" || formProps.qty == "0") {
		messages.push({text: 'Please select quantity', key: 'qty'})
	}
	if (messages.length > 0) {
		dispatch({type: ADD_ERROR, payload: messages})
		return
	}

	console.log(`adding item: ${JSON.stringify(formProps)} to cart`)

	let cartid = localStorage.getItem('cartid') ? 
				localStorage.getItem('cartid') : 0
	let headers = {
		"headers": {
			'Content-Type': 'application/json',
			"Cartid" : cartid
		}
	}
	const response = await axios.post(`${api_url}/cart`, formProps, headers ).then((response)=>{
		dispatch({type : "SHOW_CART", payload: response.data})
		callback()
	}).catch(function (error) {
		console.log(error)
		messages.push({text: "An error occured. Please try again.", key: 'SingleError'})
		dispatch({type: ADD_ERROR, payload: messages})
	});
};

export const addItemPrivate = (formProps, item, callback) => async dispatch => {

	dispatch({type: ADD_ERROR, payload: []})

	/* TODO: HANDLE AUTH */

			/* error handling */
		let messages = []

		// if (!formProps.size) {
		// 	messages.push({text: 'Please select size option'})
		// }
		console.log(`adding item: ${JSON.stringify(formProps)}`)

	
		if (item.options) {
			Object.keys(item.options).map(type => {
						
				if(!formProps[type]) {
					messages.push({text: `Please select ${type} option`, key: type})
				}
			
			})
		}

		
		if (formProps.qty.trim() == "" || formProps.qty == "0") {
			messages.push({text: 'Please select quantity'})
		}
		if (messages.length > 0) {
			dispatch({type: ADD_ERROR, payload: messages})
			return
		}

		console.log(`adding item to private cart: ${JSON.stringify(formProps)}`)

		let headers = {
			"headers": {
				"Authorization" : localStorage.getItem('token'),
				'Content-Type': 'application/json'
			}
		}
		const response = await axios.post(`${api_url}/priv/cart`, formProps, headers ).then((response)=>{
			dispatch({type : "SHOW_CART", payload: response.data})
			callback()
		}).catch(function (error) {
			console.log(error)
			messages.push({text: "An error occured. Please try again.", key: 'SingleError'})
			dispatch({type: ADD_ERROR, payload: messages})
		});


}; 

export const getOrderDetails = (id, callback) => async dispatch => {

	let data = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"id" : id
		}
	}
	console.log(`requesting details for order: ${id} `)
	// console.log(data)
	return axios.get(`${api_url}/priv/order`, data).then((response)=> {
		dispatch({type : "SHOW_ORDER", payload: response.data})
	}).catch(function (error) {
		// if (error) throw error
		callback()
	});
}

export const loadItem = (name, callback) => async dispatch => {

    	let data = {
    		"headers": {
    			'Content-Type': 'application/json'
    		},
				"params" : {
					"name" : name
				}
    	}
    console.log(`requesting item: ${name} `)
		// console.log(data)
		return axios.get(`${api_url}/item`, data).then((response)=> {
			dispatch({type : "SHOW_ITEM", item: response.data})
		}).catch(function (error) {
	   		if (error) throw error
		});
}


export const loadCart = () => async dispatch => {

	console.log(`loading cart data`)
	let cartid = localStorage.getItem('cartid') ? localStorage.getItem('cartid') : 0
	let data = {
		"headers": {
			'Content-Type': 'application/json',
			'Cartid' : cartid
		}
	}
	return axios.get(`${api_url}/cart`, data).then((response)=> {
		/* if cartid received, set local storage, dispatch empty cart */
		if (response.data.cartid) {
			console.log('Saving cartid to localStorage')
			localStorage.setItem('cartid', response.data.cartid)
			dispatch({type : "SHOW_CART", cart: []})
			return
		}

		dispatch({type : "SHOW_CART", payload: response.data})
	}).catch(function (error) {
		if (error) throw error
	});
}

export const loadGuest = (callback) => async dispatch => {

	console.log(`loading guest data`)
	let cartid = localStorage.getItem('cartid')
	let data = {
		"headers": {
			'Content-Type': 'application/json',
			'Cartid' : cartid
		} 
	}
	return axios.get(`${api_url}/guest`, data).then((response)=> {
		dispatch({type : "SHOW_CUSTOMER", payload: response.data})
		callback()
	}).catch(function (error) {
		if (error) throw error
	});
}

export const loadCartPrivate = () => async dispatch => {

	console.log(`loading private cart data`)

	let data = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	}
	
	if (localStorage.getItem('cartid')) {
		data["headers"]["Cartid"] = localStorage.getItem('cartid')
	}

	return axios.get(`${api_url}/priv/cart`, data).then((response)=> {
		/* if cartid still set, then we merge, so remove */
		if (localStorage.getItem('cartid')) {
			console.log('removing cartid after merge')
			localStorage.removeItem('cartid')
		}
		dispatch({type : "SHOW_CART", payload: response.data})
	}).catch(function (error) {
		if (error) throw error
	});
}

export const getShippingAddress = () => async dispatch => {

	console.log(`Obtaining shipping address`)

	let data = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	} 
	return axios.get(`${api_url}/priv/address`, data).then((response)=> {
		dispatch({type : "GET_SHIPPING", payload: response.data})
	}).catch(function (error) {
		if (error) throw error
	});
} 

export const deleteCartItem = (formProps) => async dispatch => {

	dispatch({type: ADD_ERROR, payload: "" })
	console.log(`deleting item item: ${JSON.stringify(formProps)} from cart`)
	let headers = {
		"headers": {
			'Content-Type': 'application/json',
			"cartid" : localStorage.getItem('cartid'),
		},
		"params" : {
			"action" : 'delete'
		}
	}
	const response = await axios.post(`${api_url}/cart`, formProps, headers ).then((response)=>{
		dispatch({type: "SHOW_CART", payload: response.data})
	}).catch(function (error) {

	});
};

export const removeSubscriptionItem = (formProps) => async dispatch => {


	console.log(`removing item: ${JSON.stringify(formProps)} from active subscription`)


	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action" : 'removeItem'
		}
	}
	const response = await axios.post('https://api.clothoak.com/subscription', formProps, headers ).then((response)=>{
		dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
	}).catch(function (error) {

	});
};

export const cancelSubscription = () => async dispatch => {


	console.log('Canceling subscription')


	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action" : 'cancelSubscription'
		}
	}
	const response = await axios.post('https://api.clothoak.com/subscription', {}, headers ).then((response)=>{
		dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
	}).catch(function (error) {

	});
};

export const deleteCartItemPrivate = (formProps) => async dispatch => {

	dispatch({type: ADD_ERROR, payload: "" })
	console.log(`deleting item from private cart: ${JSON.stringify(formProps)} from cart`)
	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action" : 'delete'
		}
	}
	const response = await axios.post(`${api_url}/priv/cart`, formProps, headers ).then((response)=>{
		dispatch({type: "SHOW_CART", payload: response.data})
	}).catch(function (error) {

	});
};

export const loadCustomer = () => async dispatch => {

	console.log(`loading customer data`)


	let data = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	}


	return axios.get(`${api_url}/priv/customer`, data).then((response)=> {

		dispatch({type : "SHOW_CUSTOMER", payload: response.data})
	}).catch(function (error) {
		if (error) throw error
	});
}

export const updateShippingAddress = (formProps, callback) => async dispatch => {

	console.log(`Updating shipping address to ${JSON.stringify(formProps)}`)
	dispatch({type: ADD_ERROR, payload: "" })
	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	}
	const response = await axios.post(`${api_url}/priv/address`, formProps, headers ).then((response)=>{
		// dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
		dispatch({type : "GET_SHIPPING", payload: response.data})

	}).catch(function (error) {
	});
}

export const updateGuest = (formProps, callback) => async dispatch => {

	console.log(`Saving Guest address ${JSON.stringify(formProps)}`)
	dispatch({type: ADD_ERROR, payload: "" })

	let messages = []
	
	let headers = {
		"headers": {
			'Content-Type': 'application/json',
			"cartid" : localStorage.getItem('cartid'),
		},
	} 
	const response = await axios.post(`${api_url}/address`, formProps, headers ).then((response)=>{
		// dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
		if(response.data == 'exists') {
			console.log('customer already exists!')
		
			messages.push({text: `customer already exists! Please login`, key: 'exists'})
			dispatch({type: ADD_ERROR, payload: messages })
			return
		} else {
			dispatch({type : "SHOW_CUSTOMER", payload: response.data}) 
		}
	

	}).catch(function (error) {
	});
}

export const updateBillingAddress = (formProps, callback) => async dispatch => {

	console.log(`Updating billing address to ${JSON.stringify(formProps)}`)

	dispatch({type: ADD_ERROR, payload: "" })


	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action" : 'updateBilling'
		}
	}
	const response = await axios.post('https://api.clothoak.com/subscription', formProps, headers ).then((response)=>{
		// dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
	}).catch(function (error) {

	});

}

export const submitPayment = (token, callback) => async dispatch => {

	console.log(`submitting tokenized payment to backend`)


	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	}
	const response = await axios.post(`${api_url}/priv/payment`, token, headers ).then((response)=>{
		dispatch({type : "PAYMENT_SUCCESS", payload: response.data})
        callback()
	}).catch(function (error) {

	});

}

export const submitPaymentGuest = (token, callback) => async dispatch => {

	console.log(`submitting guest payment to backend`)


	let headers = {
		"headers": {
			'Content-Type': 'application/json',
			"cartid" : localStorage.getItem('cartid'),
		}
	}
	const response = await axios.post(`${api_url}/payment`, token, headers ).then((response)=>{
		dispatch({type : "PAYMENT_SUCCESS", payload: response.data})
        callback()
	}).catch(function (error) {

	});

}

export const updateCard = (token, callback) => async dispatch => {

	console.log(`updating card  using token: ${token}`)


	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action": 'updateCard'
		}
	}
	const response = await axios.post('https://api.clothoak.com/payment', token, headers ).then((response)=>{
		dispatch({type : "PAYMENT_METHOD", payload: response.data})
		callback()
	}).catch(function (error) {

	});

}

export const getCard = (token, callback) => async dispatch => {


	let data = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	}


	return axios.get('https://api.clothoak.com/payment', data).then((response)=> {
		dispatch({type : "PAYMENT_METHOD", payload: response.data})
		callback()
	}).catch(function (error) {

	});

}


export const mergeCartWithActive = (callback) => async dispatch => {

	console.log(`Updating active subscription with current cart items`)

	let formProps = {}

	dispatch({type: ADD_ERROR, payload: "" })
	let headers = {
		"headers": {
			"Authorization" : localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		"params" : {
			"action" : 'mergeCart'
		}
	}
	const response = await axios.post('https://api.clothoak.com/subscription', formProps, headers ).then((response)=>{
		dispatch({type : "SHOW_SUBSCRIPTION", payload: response.data})
		callback()
	}).catch(function (error) {
	});
}



