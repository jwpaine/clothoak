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

function Customer(email) {
	this.email = email
	this.customerData = null
}

Customer.prototype.create = function(docClient, guest, callback) {
// create custoemr from guest

let customerData = guest
customerData.email = this.email
customerData.guest = true;

var params = {
	TableName : 'clothoak_subscription',
	Item : customerData
  }
  
  docClient.put(params, function(err, data) {
	  if (err) {
		  callback(err, null)
		  return
	  }
	  callback(null, customerData)

	})

}

Customer.prototype.exists = function(dynamodb, callback) {
	var params = {
		TableName : 'clothoak_subscription',
		AttributesToGet: [ "email" ],
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
		
		callback(null, attr.unwrap(data.Item).email != null)
	})
}

Customer.prototype.get = function(dynamodb, callback) {

	var params = {
		TableName : 'clothoak_subscription',
		// AttributesToGet: [ "cartitems" ],
		Key : {
			"email" : {
				"S" : this.email
			}
		}
	}
	/* retrive cart data */
	dynamodb.getItem(params, function(err, data){
   		if(err){
   			callback(err, null)
   			return
   		}
		callback(null, attr.unwrap(data.Item))
	})
}

Customer.prototype.cache = function(customerData) {
	this.customerData = customerData
}

Customer.prototype.order = function() {
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

Customer.prototype.address = function() {

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
		update: (docClient, address, addressType, callback) => {
			console.log(`updating address`);
			docClient.update({
            	TableName: 'clothoak_subscription',
            	Key: { 'email': this.email },
            	ReturnValues: 'UPDATED_NEW',
            	UpdateExpression: 'set #addressType = :address',
            	ExpressionAttributeNames: {
                	'#addressType': addressType
            	},
            
            	ExpressionAttributeValues: {
                    ':address': address
                }
            }, function(err, data) {
                
				if(err) {
               		callback(err, null)
                   	return
				 }
               	callback(null, data["Attributes"])
            })
		}
	}


}
Customer.prototype.cart = function() {
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
		add: (docClient, items, callback) => { 
			console.log(`adding cart item ${JSON.stringify(items)} for user ${this.email}`)
			docClient.update({
				TableName: 'clothoak_subscription',
				Key: { 'email': this.email },
				ReturnValues: 'ALL_NEW',
				UpdateExpression: 'set #cartitems = list_append(if_not_exists(#cartitems, :empty_list), :cartitems)',
				ExpressionAttributeNames: {
					'#cartitems': 'cartitems'
				},
				ExpressionAttributeValues: {
					':cartitems': items,
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
		get: (dynamodb, callback) => { 
			console.log(`obtaining cart data for user ${this.email}`)
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
			dynamodb.getItem(params, function(err, data) {
				if (err) {
					callback(err, null)
					return
				}
				if (data.Item.cartitems) {
					let cartitems = attr.unwrap(data.Item).cartitems
					callback(null, cartData(cartitems))
					return
				}
				callback(null, cartData([]));
			})
		}
	}
}




module.exports = Customer
