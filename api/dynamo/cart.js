const attr = require('dynamodb-data-types').AttributeValue;
const taxRate = 0.055;

exports.get = function(dynamodb, cartid, callback) {

	var params = {
		TableName : 'clothoak_cart',
		AttributesToGet: [ "cartitems" ],
		Key : { 
			"id" : {
				"S" : cartid
			}
		}
	}
	dynamodb.getItem(params, function(err, data){
		if(err){
			callback(err, null)
			return
		} 
                
                
		if (data.Item) {
			let cartitems = attr.unwrap(data.Item).cartitems
			callback(null, cartData(cartitems))
			return
		}
		callback(null, cartData([]))
	})
}

exports.merge = function(dynamodb, docClient, cartid, email, callback) {

	var params = {
		TableName : 'clothoak_cart',
		AttributesToGet: [ "cartitems" ],
		Key : { 
			"id" : {
				"S" : cartid 
			}
		}
	}
                          
	dynamodb.getItem(params, function(err, data){
		if(err){
			callback(err, null)
			return
		}
		if (data.Item && data.Item.cartitems) {
			let cartitems = attr.unwrap(data.Item).cartitems
			/* found items to merge */

			docClient.update({
				TableName: 'clothoak_subscription',
				Key: { 'email': email },
				ReturnValues: 'ALL_NEW',
				UpdateExpression: 'set #cartitems = list_append(if_not_exists(#cartitems, :empty_list), :cartitems)',
				ExpressionAttributeNames: {
					'#cartitems': 'cartitems'
				},
				ExpressionAttributeValues: {
					':cartitems': cartitems,
					':empty_list': []
				}
			}, function(err, updated) {
				if(err) {
					callback(err, null)
					return
				}

				let cart = updated.Attributes
				callback(null, cartData(cart.cartitems))
			});
		}
	})
}

exports.add = function(docClient, cartid, item, callback) {

	docClient.update({
		TableName: 'clothoak_cart',
		Key: { 'id': cartid },
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
}

exports.delete = function(docClient, cartid, index, callback) {

	docClient.update({
		TableName: 'clothoak_cart',
       	Key: { 'id': cartid },
       	ReturnValues: "ALL_NEW",
       	UpdateExpression: "REMOVE #i[" + index + "]",
       	ExpressionAttributeNames : {
       		"#i": "cartitems"
       	}
       }, function(err, data) {
			if(err) {
           		callback(err, null)
				return
			} 
			let cartitems = data.Attributes.cartitems
			callback(null, cartData(cartitems))
		})
}

function cartData(cartitems) {

    const subtotal = cartitems.reduce((a, b) => a + b.price*b.qty, 0) 
    const shipping = 2*cartitems.length
    // const tax = Math.round((subtotal + shipping)*taxRate * 100) / 100
    const total = subtotal + shipping
    
    return {
        "cartitems" : cartitems,
        "subtotal" : subtotal,
        "shipping" : shipping == 0 ? "Free!" : shipping,
        "total" : total
    }
}
