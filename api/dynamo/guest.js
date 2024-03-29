/*
	Customer table

*/
const attr = require('dynamodb-data-types').AttributeValue
const taxRate = 0.055

function cartData(cartitems) {

	const subtotal = cartitems.reduce((a,b) => a + b.price*b.qty, 0)
	const shipping = 2*cartitems.length
	const total = subtotal + shipping
	
	return {
		"cartitems" : cartitems,
		"subtotal" : subtotal,
		"shipping" : shipping == 0 ? "Free!" : shipping,
		"total" : total
	}
}

function cartQty(cartitems) {

	const qty = cartitems.reduce((a,b) => a + b.qty, 0)

	return qty
}

function Guest(cartid) {
	this.cartid = cartid
	this.customerData = null
}

Guest.prototype.get = function(redis, callback) {

	redis.get(this.cartid, function(err, guest) {
        if (err) {
            callback(err, null)
            return
        }
        if(guest) {
            let g = JSON.parse(guest)
            callback(null, g)
            return
        }
        console.log('redis: not found')
        callback(null, {})
    });
}

Guest.prototype.delete = function(redis, callback) {
	redis.del(this.cartid, function(err, response) {
		if (err) {
		   callback(err, null)
		   return
		} 
		callback(null, response)
	 })
}

Guest.prototype.cache = function(customerData) {
	this.customerData = customerData
}

Guest.prototype.order = function() {
	return {
		// save order and flush cart
		save : (docClient, cartData, charge, customer, callback) => {
			let date = new Date()
			let order = {
				'items' : cartData,
				'charge' : charge,
				'customer' : customer,
				'shipping' : this.customerData.shipping,
				'created' : JSON.stringify(date),
				'status' : 'Processing'
			}
			docClient.update({
				TableName: 'clothoak_subscription',
                Key: { 'email': this.email },
                ReturnValues: 'ALL_NEW',
                UpdateExpression: 'SET #cartitems = :empty_list, #orders = list_append(if_not_exists(#orders, :empty_list), :order)',

                ExpressionAttributeNames: {
                	'#orders' : 'orders',
                    '#cartitems' : 'cartitems'
                },
                ExpressionAttributeValues: {
                	':order' : [order],
                  	':empty_list' : [] 
                }
      		}, function(err, data) {

          		if (err) {
                	console.log(err);
                    callback(err, null)
                    return
            	}
				callback(null, 'success!')
			})
		},
		getAll : (dynamodb, callback) => {
			var params = {
				TableName : 'clothoak_subscription',
				"AttributesToGet": [ "orders" ],
				Key : { 
				   "email" : {
					 "S" : this.email
				   }
				 }
			 }
							   
			 dynamodb.getItem(params, function(err, data){
				 if(err){
					callback(err, null)
					return
				 }
				 let orders = attr.unwrap(data.Item)
				 callback(null, orders)
				})
		},

		get : (dynamodb, index, callback) => {
			var params = {
				TableName : 'clothoak_subscription',
				"AttributesToGet": [ "orders" ],
				Key : { 
				   "email" : {
					 "S" : this.email
				   }
				 }
			 }
							   
			 dynamodb.getItem(params, function(err, data){
				 if(err){
					callback(err, null)
					 return
				 }
				 
				let customer_data = attr.unwrap(data.Item)
				  
				if(customer_data && customer_data.orders) {
					   
					if ( index > -1 && index <= customer_data.orders.length ) {
					   	let order = customer_data.orders[index]
					   
						let r = {
							'items' : order.items,
							'last4' : order.charge.source.last4,
							'created' : order.created,
							'status' : order.status
						}
						callback(null, r)
						return
					}

					callback("Order index out of bounds", null)
					return
				}
				callback("No orders for customer", null)
			})
		}
	}
}

Guest.prototype.address = function() {

	return {
		get: (dynamodb, callback) => {
			console.log(`obtaining address`)	

			var params = {
              TableName : 'clothoak_subscription',
              "AttributesToGet": [ "shipping" ],
              Key : { 
                  "email" : {
                    "S" : this.email
                  }
                }
            }
                  
            dynamodb.getItem(params, function(err, data){
                if(err){
                  	callback(err, null)
                  	return
                }
                const address = attr.unwrap(data.Item)
				callback(null, address)
			})
		},
		update: (redis, address, addressType, callback) => {
			console.log(`updating address`);
			let cartid = this.cartid
			redis.get(cartid, function(err, cart) {
				if (err) {
					console.log(err)
					callback(err, null)
					return
				}
				if(cart) {
					let c = JSON.parse(cart)
					c[addressType] = address;
					redis.set(cartid, JSON.stringify(c));
					callback(null, c)
					return
				}
				callback(null, {}) 
			});
		}
	}


}
Guest.prototype.cart = function() {
	let params = {
		TableName: 'clothoak_subscription',
		AttributesToGet: [ "cartitems" ],
		Key: {
			"email": {
				"S": this.email
			}
		}	
	}
	return {
		add: (docClient, item, callback) => { 
			console.log(`adding cart item ${JSON.stringify(item)} for user ${this.email}`)
			docClient.update({
				TableName: 'clothoak_subscription',
				Key: { 'email': this.email },
				ReturnValues: 'ALL_NEW',
				UpdateExpression: 'set #cartitems = list_append(if_not_exists(#cartitems, :empty_list), :cartitems)',
				ExpressionAttributeNames: {
					'#cartitems': 'cartitems'
				},
				ExpressionAttributeValues: {
					':cartitems': [item],
					':empty_list': []
				}
			}, function(err, data) {
				if(err) {
					callback(err, null)
					return
				}

				let cartitems = data.Attributes.cartitems
				callback(null, cartData(cartitems))
			})	

	
		},
		remove: (docClient, index, callback) => { 
			console.log(`removing cart item ${index} for user ${this.email}`)
			docClient.update({
				TableName: 'clothoak_subscription',
				Key: { 'email': this.email },
				ReturnValues: 'ALL_NEW',
				UpdateExpression: "REMOVE #i[" + index + "]",
				ExpressionAttributeNames: {
					'#i': 'cartitems' 
				},
			}, function(err, data) {
				if(err) {
					callback(err, null)
					return
				}

				let cartitems = data.Attributes.cartitems
				callback(null, cartData(cartitems))
			})	


		},
		get: (redis, callback) => { 
			console.log(`obtaining cart data for user ${this.cartid}`)
			// if customer data already exists, use prefetched
			if (this.customerData) {
				console.log(`prefetched`)
				let cartitems = this.customerData.cartitems
				if (cartitems) {
					callback(null, cartData(cartitems))
				}
				return
			}
			// customer data not prefetched, obtain cart data
			console.log('not prefetched')
			redis.get(this.cartid, function(err, g) {
				if (err) {
					callback(err, null)
					return
				}

				console.log(`cart1: ${g}`)

				callback(null, cartData(g.cartitems))

			})
			// dynamodb.getItem(params, function(err, data) {
			// 	if (err) {
			// 		callback(err, null)
			// 		return
			// 	}
			// 	if (data.Item.cartitems) {
			// 		let cartitems = attr.unwrap(data.Item).cartitems
			// 		callback(null, cartData(cartitems))
			// 		return 
			// 	}
			// 	callback(null, cartData([]));
			// })
		}
	}
}




module.exports = Guest
