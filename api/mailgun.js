var mailgun = require('mailgun-js');

function Mailgun(apiKey) {
    this.mailgun = new mailgun({apiKey: apiKey, domain: 'clothoak.com'});
}

Mailgun.prototype.send = function(sender, recipient, subject, body, callback) {
    
    var data = {
        from: sender,
        to: recipient,
        bcc: sender, 
        subject: subject,
        html: body
    }
                
    this.mailgun.messages().send(data, function (err, body) {
                     
        if (err) {
            console.log(err)
            callback(err, null)
            return
        }
        
        callback(null, body)         
    })  
}

module.exports = Mailgun