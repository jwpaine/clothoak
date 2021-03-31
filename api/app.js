const express = require('express')
const cors = require('cors')
const CognitoExpress = require("cognito-express")
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const Redis = require("redis");
const app = express()
const authenticatedRoute = express.Router();
const port = 8080

// const cart = require('./dynamo/cart')
const cart = require('./redis/cart')

const item = require('./dynamo/item')
const Customer = require('./dynamo/customer')
const Guest = require('./dynamo/guest') 

const Mailgun = require('./mailgun')
const StripeConnect = require('./stripe')



const config = require('./config.json')
AWS.config.update(config.aws);
const cognitoExpress = new CognitoExpress(config.cognito);
const mailgun = new Mailgun(config.mailgun.secretApiKey) 
const stripe = require("stripe")(config.stripe.secretApiKey);


let docClient = new AWS.DynamoDB.DocumentClient()
let dynamodb = new AWS.DynamoDB()
const redis = Redis.createClient({
	"host" : config.redis.host,
	"port" : config.redis.port,
	"password" : config.redis.password
});

app.use("/priv", cors(), authenticatedRoute);
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Nothing here :('))
app.get('/test', (req, res) => res.send('Test confirmed!'))

authenticatedRoute.use(express.json())

authenticatedRoute.use(function(req, res, next) {
    
    let accessTokenFromClient = req.header('Authorization')
    //Fail if token not present in header. 
	if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header")
	
 
    cognitoExpress.validate(accessTokenFromClient, function(err, response) {
        //If API is not authenticated, Return 401 with error message. 
        if (err) return res.status(401).send(err);
        //Else API has been authenticated. Proceed.
        res.locals.user = response;
        next()
    })
})


authenticatedRoute.post("/payment", function(req, res, next) {

	// get customer data by email
	let customer = new Customer(res.locals.user.email)

	customer.get(dynamodb, function(err, c) {
		if (err) return res.status('502').send(err)
		customer.cache(c)

		StripeConnect.createCustomer(stripe, req.body.id, res.locals.user.email, c.shipping, function(err, stripeCustomer) {
			if(err) {
				console.log(err)
				return res.status(502).send(err)
			}
			// get order data
			customer.cart().get(null, function(err, cartData) {
				if (err) return res.status(502).send(err)
			    // TODO: verify cartData	
				console.log(`cart total: ${cartData.total}`)
				// charge customer
				StripeConnect.chargeCustomer(stripe, stripeCustomer.id, res.locals.user.email, cartData.total, function(err, charge) {
					if (err) return res.status(502).send() 
					// save order and empty cart	
					customer.order().save(docClient, cartData, charge, stripeCustomer, function(err, r) {
						if (err) return res.status(502).send(err)
						res.send('success!')

						// send order info via email
						let orderDetails = '--- Order Summary --- <br/>'


						let cartItems = cartData.cartitems
						for (var i in cartItems) {
							orderDetails += `Item: ${cartItems[i].name}, Color: ${cartItems[i].color}, Price: ${cartItems[i].price}, Quantity: ${cartItems[i].qty} <br/>`
						}

						orderDetails += `<br/>`
						orderDetails += `Subtotal: ${cartData.subtotal} <br/>`
						orderDetails += `Shipping: ${cartData.shipping} <br/>`
						orderDetails += `Total: ${cartData.total} <br/>`

						orderDetails += '------------------ <br/></br/>'

						orderDetails += `If you have any questions regarding this order, please don't hesitate to reach out to us at <a href="mailto:support@clothoak.com">support@clothoak.com</a>`


						let body = `Thank you for your order! Your order is being processed and we will send another email once it has shipped. You may view order status anytime by visiting https://clothoak.com/account and clicking on 'order details' <br/><br/> ${orderDetails}`
						mailgun.send('orders@clothoak.com', res.locals.user.email, 'Your ClothoaK.com order', body, function(err, r) {
							if (err) {
								console.log(err)
								return
							}
							console.log('Order placement email sent successfully!')
						})

					});
				})	
			})
		});
	})
})


app.post("/payment", function(req, res, next) {

	// get customer data by email
	let cartid = req.header('Cartid')

	console.log(`processing payment for guest: ${cartid}`)
	console.log(`${JSON.stringify(req.body)}`) 

	let guest = new Guest(cartid)


	guest.get(dynamodb, function(err, g) {
		if (err) return res.status('502').send(err)

		console.log(`guest data obtained: ${JSON.stringify(g)}`)

		let email = g.shipping.email
		let customer = new Customer(email)
		customer.create(docClient, g, function(err, c) {
			if (err) {
				if (err) return res.status(502).send(err)
			}
			console.log(`Guest saved as new customer: ${JSON.stringify(c)}`)
			customer.cache(c)

			StripeConnect.createCustomer(stripe, req.body.id, email, c.shipping, function(err, stripeCustomer) {
				if(err) {
					console.log(err)
					return res.status(502).send(err)
				}
				// get order data
				customer.cart().get(null, function(err, cartData) {
					if (err) return res.status(502).send(err)
					// TODO: verify cartData	
					console.log(`cart total: ${cartData.total}`)
					// charge customer
					StripeConnect.chargeCustomer(stripe, stripeCustomer.id, email, cartData.total, function(err, charge) {
						if (err) {
							console.log(err)
							return res.status(502).send('error') 
						} 
						// save order and empty cart	
						customer.order().save(docClient, cartData, charge, stripeCustomer, function(err, r) {
							if (err) { 
								console.log(err)
								return res.status(502).send(err)
							}

							res.send('success!')
	
							// send order info via email
							let orderDetails = '--- Order Summary --- <br/>'
	
	
							let cartItems = cartData.cartitems
							for (var i in cartItems) {
								orderDetails += `Item: ${cartItems[i].name}, Color: ${cartItems[i].color}, Price: ${cartItems[i].price}, Quantity: ${cartItems[i].qty} <br/>`
							}
	
							orderDetails += `<br/>`
							orderDetails += `Subtotal: ${cartData.subtotal} <br/>`
							orderDetails += `Shipping: ${cartData.shipping} <br/>`
							orderDetails += `Total: ${cartData.total} <br/>`
	
							orderDetails += '------------------ <br/></br/>'
	
							orderDetails += `If you have any questions regarding this order, please don't hesitate to reach out to us at <a href="mailto:support@clothoak.com">support@clothoak.com</a>`
	
	
							let body = `Thank you for your order! Your order is being processed and we will send another email once it has shipped. You may view order status anytime by visiting https://clothoak.com/account and clicking on 'order details' <br/><br/> ${orderDetails}`
							mailgun.send('orders@clothoak.com', email, 'Your ClothoaK.com order', body, function(err, r) {
								if (err) {
									console.log(err)
									return
								}
								console.log('Order placement email sent successfully!')
							})
	
						});
					})	
				})
			});
		})
	})
})

			
	// customer.get(dynamodb, function(err, c) {
	// 	if (err) return res.status('502').send(err)
		
	// 	customer.cache(c)
	// 	if (c.stripecustomer) {
	// 		console.log(`stripe customer exists`)
	// 		// get cart total
	// 		customer.cart().get(null, function(err, cartData) {
	// 			if (err) return res.status(502).send(err)
	// 		    // TODO: verify cartData	
	// 			console.log(`cart total: ${cartData.total}`)
	// 			// charge customer
	// 			StripeConnect.chargeCustomer(stripe, c.stripecustomer.id, res.locals.user.email, cartData.total, function(err, charge) {
	// 				if (err) return res.status(502).send(err)
				
	// 				// save order and empty cart	
	// 				customer.order().save(docClient, cartData, charge, c.stripecustomer, function(err, r) {
	// 					if (err) return res.status(502).send(err)
						
	// 					res.send('success!')
	// 				});
	// 			})	
				
	// 			return
	// 		})	
	// 	return
	// 	} 
	//	console.log(`stripe customer does not exist`)
		// create stripeCustomer
		// charge StripeCustomer
		// create order object
		// save stripeCustomer, clear cart, append order
	// })
	
//	console.log(`--> ${JSON.stringify(req.body)}`)


authenticatedRoute.get("/customer", function(req, res, next) {
	
	let customer = new Customer(res.locals.user.email)
	
	customer.get(dynamodb, function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})

authenticatedRoute.get("/address", function(req, res, next) {
	
	let customer = new Customer(res.locals.user.email)
	
	customer.address().get(dynamodb, function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})
authenticatedRoute.post("/address", function(req, res, next) {
	
	let customer = new Customer(res.locals.user.email)
	
	customer.address().update(docClient, req.body, 'shipping', function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})

app.post("/guest", function(req, res, next) {

	let cartid = req.header('Cartid')

	console.log(`updating data for guest using cartid: ${cartid}`)
	console.log(`${JSON.stringify(req.body)}`) 

	let guest = new Guest(cartid)

	guest.address().update(docClient, req.body, 'shipping', function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})

app.get("/guest", function(req, res, next) {

	let cartid = req.header('Cartid')

	console.log(`updating data for guest: ${cartid}`)
	let guest = new Guest(cartid)

	guest.get(dynamodb, function(err, r) {
		if (err) {
			console.log(err) 
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})
 
})

authenticatedRoute.get("/cart", function(req, res, next) {


	let cartid = req.header('Cartid')
	if(cartid){
		console.log(`merge cartid ${cartid} for user ${res.locals.user.email}`)
		cart.merge(dynamodb, docClient, cartid, res.locals.user.email, function(err, r) {
			if (err) {
				return res.status(502).send(err)
			}
			res.send(r)
		})
		return
	}

	let customer = new Customer(res.locals.user.email) 

	customer.cart().get(dynamodb, function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})

authenticatedRoute.get("/order", function(req, res, next) {
	
	console.log(`requesting order: ${JSON.stringify(req.query)}`)
	let customer = new Customer(res.locals.user.email)
	
	customer.order().get(dynamodb, req.query.id, function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})

})

app.post("/notifyme",  function(req, res, next) {
	
	console.log(`notifyme: ${JSON.stringify(req.body)}`) 
	
	item.notify(docClient, req.body.item, req.body.email, function(err, r) {
			if (err) {
				return res.status(502).send(err)
			}
			res.send('ok')
	})
}) 

app.get("/cart", function(req, res, next) {

	// if req.query.cartid undefined, generate cartid and return
	let cartid = req.header('Cartid')
	if (cartid == 0) {
		console.log(`generating cartid`)
		res.send({'cartid' : uuidv1()})
		return
	}
	// return cart data
	console.log(`Cart requested for cartid: ${cartid}`)
	cart.get(redis, cartid, function(err, r) {
		if (err) {
			return res.status(502).send(err)
		}
		res.send(r)
	})
})  

app.get("/item", function(req, res, next) {
	console.log(`Getting item: ${req.query.name}`)
	item.get(dynamodb, req.query.name, function(err, r) {
		if (err) {
			return res.status(502).send(err)
		}
		res.send(r)
	})
})

app.get("/test", function(req, res) {
	console.log('/test requested')
	res.send('ok!')
});

app.post("/cart", function(req, res, next) {
	console.log(req.body)
	let cartid = req.header('Cartid')
	if(!cartid) {
		return res.status(502).send('cartid missing')
	}
	if (req.query.action) {
		if (req.query.action == 'delete') {
			let cartIndex = req.body.index
			console.log('action = delete')		 
			if (cartIndex != null) {
				console.log(`request to delete cart item: ${cartIndex}`)
				cart.delete(docClient, cartid, cartIndex, function(err, r) {
					if (err) {
						console.log(err)
						return
					}
					res.send(r)
				})
				return
			}
			console.log(`no index specified for deletion`)
			return res.status(502).send('no index specified')
		}
		console.log('non-implemented action provided')
		return res.status(502).send('invalid action')
	}
	console.log(`adding item to cart: ${JSON.stringify(req.body)}`)
	cart.add(redis, cartid, req.body, function(err, r) {
		if (err) {
			console.log(err)
			return res.status(502).send("An error occured")
		}
		res.send(r)
	})
})

authenticatedRoute.post("/cart", function(req, res, next) {

	let customer = new Customer(res.locals.user.email)

	if (req.query.action) {
		if (req.query.action == 'delete') {
			console.log('action = delete')		
			let cartIndex = req.body.index
			if (cartIndex != null) {
				customer.cart().remove(docClient, cartIndex, function(err, r) {
					if (err) {
						console.log(`err`)
						return res.status(502).send(err)
					}	 	
					return res.send(r)
				});
				return
			}
			console.log(`no index specified for deletion`)
			return res.status(502).send('no index specified')
		//res.send('ok')
		// return
		}
		console.log('non-implemented action provided')
		return res.status(502).send('invalid action')
	}
				
	customer.cart().add(docClient, req.body, function(err, r) {
		if (err) {
			console.log(`err`)
			return res.status(502).send(err)
		}
		console.log(`success`)
		res.send(r)
	})
})

app.listen(port, () => console.log(`Listening on port ${port}`))

