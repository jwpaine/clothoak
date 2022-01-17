

const taxRate = 0.055;
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



function Cart() {
	this.cart = {}
}

Cart.prototype.get = function(key, callback) {
	callback(null, this.cart[key] || null )

}

Cart.prototype.set = function(key, value) {
	this.cart[key] = value
}

Cart.prototype.del = function(key) {
	this.cart[key] = value = null
}

module.exports = Cart
