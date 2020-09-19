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
