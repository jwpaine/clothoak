const attr = require('dynamodb-data-types').AttributeValue;
const taxRate = 0.055;

exports.get = function(redis, cartid, callback) {

    redis.get(cartid, function(err, cart) {
        if (err) {
            console.log(err)
            callback(err, null)
            return
        }
        if(cart) {
            console.log(`redis cart: ${cart}`);
            let c = JSON.parse(cart)
            let cartItems = c.cartitems
            callback(null, cartData(cartItems))
            return
        }

        console.log('redis: not found')
        callback(null, cartData([]))
        return
     
    });
}

exports.add = function(redis, cartid, item, callback) {

    redis.get(cartid, function(err, cart) {
        if (err) {
            console.log(err)
            callback(err, null)
            return
        }
        if(cart) {
            let c = JSON.parse(cart)
            c.cartitems.push(item)
            redis.set(cartid, JSON.stringify(c));
            callback(null, cartData(c.cartitems))
            return
        }
        let c = {'cartitems' : [item]}
        redis.set(cartid, JSON.stringify(c));
        callback(null, cartData([item]))
        return 
     
    });

}

exports.delete = function(redis, cartid, index, callback) {

    redis.get(cartid, function(err, cart) {
        if (err) {
            console.log(err)
            callback(err, null)
            return
        }
        if(cart) {
            let c = JSON.parse(cart)
            if(index <= c.cartitems.length) {
                c.cartitems.splice(index, 1)
                if(c.cartitems.length > 0) {
                    redis.set(cartid, JSON.stringify(c));
                } else {
                    redis.del(cartid)
                }
                callback(null, cartData(c.cartitems))
                return
            }
            callback('Out of bounds', null)
        }
     
    });
    
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
