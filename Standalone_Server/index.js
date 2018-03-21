const http = require('http');
const firebase = require("firebase");
const say = require('say');
const bt = require('./bt_helper');
const fs = require('fs');

//variable to store the array of registered devices
var registered_devices;

//firebase configuration
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: ""
};

//read and parse registered bluetooth devices from 'bt_devices.json'
fs.readFile('bt_devices.json', 'utf8', function (err, data) {
    if (err) throw err;
    registered_devices = JSON.parse(data);
    console.log("Registered Devices : ", registered_devices);
});

//firebase initialization
firebase.initializeApp(config);
var database = firebase.database();


//Twilio initialization
var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = '';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var twilioNo = '';
var smsClient = new twilio(accountSid, authToken);


//look for visitors updates in firebase db 
//Reference for firebase object read/write : https://firebase.google.com/docs/database/web/read-and-write
/*
***Sample visitors object***
{
  "DeviceId" : "50:DC:E7:D6:F5:DD",
  "EmployeeName" : "Abu Mathew Thoppan",
  "ResponseStatus" : "Announced",
  "TimeStamp" : 1520911940857,
  "VisitorName" : ""
}
******
*/
var visitorsRef = database.ref('visitors');
visitorsRef.on('child_added', function (data) {
    //if (registered_devices.indexOf(data.val().DeviceId) > 0) {
        if (data.val().ResponseStatus == 'AwaitingResponse') {
            SpeakOutNotification('Hey ' + data.val().EmployeeName + ", You have got a visitor.", data.val().DeviceId);
            database.ref('visitors/' + data.val().TimeStamp).update({ ResponseStatus: 'Announced' });
            console.log(data.val());
            //SendSMS(data.val().EmployeeName, data.val().VisitorName);
        }
    //}
});

/*
***Sequentialing the speak out notification***
1. Disconnect any active bluetooth connection
2. Connect to the bluetooth device with mac = deviceId
3. 5 sec delay
4. Speak text
5. 5 sec delay
6. Disconnect 
*/

//Refer bt_helper.js for bluetooth functions 

function SpeakOutNotification(text, deviceId) {
    console.log('started');
    bt.disconnect(() => {
        bt.connect(deviceId, () => {
            setTimeout(() => {
                say.speak(text, null, 1.0, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('spoken "' + text + '"');
                    setTimeout(() => {
                        bt.disconnect();
                    }, 5000);
                });
            }, 5000);
        })
    });
}

function SendSMS(employeename, text = '') {
    return database.ref('/people/'+employeename+'/MobileNo').once("value").then(function (snapshot) {

    });
}

