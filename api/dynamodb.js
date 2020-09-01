/*
	Dynamodb

*/
function Dynamodb(AWS) {
	this.dynamodb = new AWS.DynamoDB()
	this.docClient = new AWS.DynamoDB.DocumentClient()
	this.key = 'foo'
}

Dynamodb.prototype.hello = function() {
	console.log(`--> ${this.key}`)
}

module.exports = Dynamodb

