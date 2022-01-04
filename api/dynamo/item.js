const attr = require('dynamodb-data-types').AttributeValue

exports.get = function(dynamodb, itemName, callback) {

	 var params = {
        TableName : 'clothoak_items',
        Key : { "name" : { "S" : itemName } },
        AttributesToGet: [ "available", "images", "options", "description", "price", "name" ]
      }
      dynamodb.getItem(params, function(err, data){
            if(err){
                callback(err, null)
                return
            } 
            
            callback(null, attr.unwrap(data.Item))
      });
}

exports.validate = function(dynamodb, cartItem, callback) {

      console.log(`validating item ${JSON.stringify(cartItem)}`)
//       console.log('success')
//       callback(null)
//    //   console.log('failure')

      if(cartItem.name) {

            var params = {
                  TableName : 'clothoak_items',
                  Key : { "name" : { "S" : cartItem.name } }, 
            }
           
            dynamodb.getItem(params, function(err, data){
                  if(err) {
                        callback('Error', null)
                        console.log(err)
                        return
                  } 
                 
                  // verify item exists
                  if(!data.Item) {
                        console.log('No such item')
                        callback('No Such Item', null)
                        return
                  }

                  let dbItem = attr.unwrap(data.Item);
                  var errors = []
                  let validatedItem = {'name' : dbItem.name, 'image' : dbItem.image, 'price' : dbItem.price, 'qty' : cartItem.qty}

                  //validate quantity
                  if(cartItem.qty <= 0 || !Number.isInteger(parseInt(cartItem.qty))) {
                        console.log('invalid quantity')
                        errors.push(`Invalid quantity`)
                  }

                  // check all item options were included
                  if (dbItem.options) {
                        Object.keys(dbItem.options).map(option => {
                              console.log(`validating item option: ${option}`)
                              // option wasn't sent
                              if(!cartItem[option]) {
                                    console.log(`Option ${option} not present`)
                                    errors.push(`Please select ${option}`)
                              } else {
                                    // option exists, validate attributes
                                    let cartAttribute = cartItem[option];
                                    let foundAttribute = false;
                                    console.log(`validating attribute value: ${cartAttribute}`)
                                    dbItem.options[option].attributes.map(dbAttribute => {
                                          // if attribute found, add to validatedItem
                                          console.log(`comparing: ${cartAttribute} -> ${dbAttribute}`)
                                          if (cartAttribute == dbAttribute) {
                                                console.log('Attribute valid, adding to validatedItem')
                                                foundAttribute = true;
                                                validatedItem[option] = cartAttribute
                                                return
                                          }
                                    })
                                    if (!foundAttribute) {
                                          console.log(`No such attribute: ${cartAttribute}`)
                                          errors.push(`No such attribute: ${cartAttribute}`)
                                    }
                              }
                             
                        })
                  }
                  // any errors? Return 'em!
                  if (errors.length > 0) {
                        callback({'errors' : errors}, null)
                        return
                  } 
                  
                  // everything checks out! Return validated item object for insertion
                  callback(null, validatedItem)
            });
            return
      }
      callback('No name key present', null)
}

exports.notify = function(docClient, item, email, callback) {
      docClient.update({
            TableName: 'clothoak_items',
            Key: { 'name': item }, 
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'SET #notify = list_append(if_not_exists(#notify, :empty_list), :email)', 

            ExpressionAttributeNames: {
                  '#notify' : 'notify' 
            },
            ExpressionAttributeValues: {
                  ':email' : [email],
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
}
