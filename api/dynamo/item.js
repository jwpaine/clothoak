const attr = require('dynamodb-data-types').AttributeValue

exports.get = function(dynamodb, itemName, callback) {

	 var params = {
        TableName : 'clothoak_items',
        Key : { "name" : { "S" : itemName } }, 
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
            var errors = []
            dynamodb.getItem(params, function(err, data){
                  if(err){
                        callback(err, null)
                        return
                  } 
                  let dbItem = attr.unwrap(data.Item);
                  console.log(`dbitem: ${JSON.stringify(dbItem)}`)
                  // validate options sent
                  if (dbItem.options) {
                       Object.keys(dbItem.options).map(option => {
                             console.log(`option: ${option}`)
                             if(!cartItem[option]) {
                                   console.log('color not selected')
                                   errors.push(`Please select ${option}`)
                             }
                       }) 
                  }
                  if (errors.length > 0) {
                        callback({'errors' : errors})
                        return
                  } 
                  
                  // everything checks out!
                  callback(null)
                
            });


            return
      }

      callback({'errors' : ['No such item']})

      
      
    
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
