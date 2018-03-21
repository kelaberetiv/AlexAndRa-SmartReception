const http = require('http');

//Twilio initialization
var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = '';   // Your Auth Token from www.twilio.com/console
var twilio = require('');
var twilioNo = '';
var smsClient = new twilio(accountSid, authToken);

function GetNumber(employeename = '') {
    return database.ref('/people/'+employeename+'/MobileNo').once("value").then(function (snapshot) {
        return snapshot.val();
    });
}

function SendSMS(number, text = '') {
    return smsClient.messages.create({
        body: text,
        to: number,  // Text this number
        from: twilioNo // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}