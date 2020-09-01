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
