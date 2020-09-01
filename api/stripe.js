/* exports.createCustomer = function() {

}

exports.chargeCustomer = function() {

}

exports.updateCard = function() {

}
*/


exports.chargeCustomer = function(stripe, customer_id, email, amount, callback) {

	let date = new Date(); 
            
      // charge customer
const charge = stripe.charges.create({
	amount: amount * 100,
	currency: "usd",
	customer: customer_id,
	receipt_email: email,
	description: `Clothoak`,
},	function(err, charge) {
		if (err) {
			console.log(`charge error: ${err}`)
			callback(err, null)
			return
		}
		console.log(`charged customer: ${JSON.stringify(charge)}`)
		callback(null, charge);
	})
}

exports.createCustomer = function(stripe, token, email, shipping, callback) {
	stripe.customers.create({
		description: 'Clothoak.com purchase',
		source: token, // token.id, // obtained with Stripe.js,
		name: shipping.name, // subscription_data.shipping.name,
		email: email, // subscription_data.email,
		address: {
			line1 : shipping.address, // subscription_data.shipping.address,
			city : shipping.city, // subscription_data.shipping.city,
			state : shipping.state, // subscription_data.shipping.state,
			postal_code : shipping.zip // subscription_data.shipping.zip
		}
		
	}, function (err, customer) {
		if (err) {
			callback(err, null)
			return
		}
		callback(null, customer)
	})
}




