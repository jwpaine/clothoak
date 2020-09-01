// create an IAM Lambda role with access to dynamodb
// Launch Lambda in the same region as your dynamodb region
// (here: us-east-1)
// dynamodb table with hash key = user and range key = datetime

console.log('Loading event');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();
const uuidv1 = require('uuid/v1');
const attr = require('dynamodb-data-types').AttributeValue;
const stripe = require("stripe")("sk_test_w6e6oKksN1qsZh52Lx5RswpM00OuPWmdYE");




// event.requestContext.authorizer.claims.email

exports.handler = function(event, context, callback) {


    switch(event.httpMethod) {
        case 'GET':

            // var params = {
            //   TableName : 'clothoak_subscription',
            //   Key : {
            //       "email" : {
            //         "S" : event.requestContext.authorizer.claims.email
            //       }
            //     }
            // }

            // dynamodb.getItem(params, function(err, data){
            //     if(err){
            //       // callback(err, null)

            //         callback(null, {
            //         statusCode: 200,
            //         headers: {
            //             "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //             "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //         }, body: JSON.stringify(event.requestContext)
            //       // }, body: "success!"
            //     });


            //         return
            //     }

            //     callback(null, {
            //         statusCode: 200,
            //         headers: {
            //             "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //             "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //         }, body: JSON.stringify(attr.unwrap(data.Item))
            //       // }, body: "success!"
            //     });

            // });

            break;
        case 'POST':

            //  if(event.queryStringParameters) {

            //     if (event.queryStringParameters.action == 'updateShipping') {

            //         updateAddress('shipping', JSON.parse(event.body), function(err, data) {
            //             if (err) {
            //               // callback(err, null)
            //               callback(null, {
            //                 statusCode: 200,
            //                 headers: {
            //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //                     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //                 }, body: JSON.stringify(err)
            //             });
            //                 return
            //             }
            //             callback(null, {
            //                 statusCode: 200,
            //                 headers: {
            //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //                     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //                 }, body: 'success'
            //             });
            //         })

            //         return
            //     }

            //      if (event.queryStringParameters.action == 'updateBilling') {

            //         updateAddress('billing', JSON.parse(event.body), function(err, data) {
            //             if (err) {
            //               // callback(err, null)
            //               callback(null, {
            //                 statusCode: 200,
            //                 headers: {
            //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //                     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //                 }, body: JSON.stringify(err)
            //             });
            //                 return
            //             }
            //             callback(null, {
            //                 statusCode: 200,
            //                 headers: {
            //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //                     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //                 }, body: 'success'
            //             });
            //         })

            //         return
            //     }
            //  }

            let token = JSON.parse(event.body)

            chargeCustomer(token, 100, function(err, charge) {

                if (err) {
                    callback(err, null);
                    return
                }

                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                    }, body: JSON.stringify(charge)
                });
            })









            // callback(null, {
            //     statusCode: 200,
            //     headers: {
            //         "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //         "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            //     }, body: JSON.stringify(token.id)
            // });

            break;
        default:
            // HTTP method not implemented
            callback(null, {
                statusCode: 501,
                headers: {
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                }
            });
    }

    function chargeCustomer(token, amount, callback) {


        // const customer = stripe.customers.create({
        //   email: event.requestContext.authorizer.claims.email,
        //   source: token.id
        // });

        stripe.customers.create({
            description: 'Customer for jenny.rosen@example.com',
            source: token.id // obtained with Stripe.js
        }, function(err, customer) {

            if (err) {
                callback(err, null)
                return;
            }

            const charge = stripe.charges.create({
                amount: amount * 100,
                currency: "usd",
                customer: customer.id,
                receipt_email: event.requestContext.authorizer.claims.email,
                description: `description`,
                shipping: {
                    name: "John Paine",
                    address: {
                        line1: "1 main street",
                        line2: "",
                        city: "Lewiston",
                        country: "United States",
                        postal_code: "04634"
                    }
                }

            },  function(err, charge) {

                if (err) {

                    callback(err, null)
                    return
                }

                callback(null, charge)

            });
        });



    }


    function updateAddress(addressType, address, callback) {

        docClient.update({
            TableName: 'clothoak_subscription',
            Key: { 'email': event.requestContext.authorizer.claims.email },
            ReturnValues: 'ALL_NEW',
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
            callback(null, data)
        })

    }



};



