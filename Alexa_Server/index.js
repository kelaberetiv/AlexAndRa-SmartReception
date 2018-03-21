'use strict';
const Alexa = require("alexa-sdk");
const firebase = require("firebase");
const https = require('https');


//Alexa Skill Usage Reference : https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs


//firebase configuration
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: ""
};

//firebase initialization
firebase.initializeApp(config);
var database = firebase.database();

//Create and write visitor object to firebase db
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
function CreateVisitorNotification(employeename = '', visitorname = '') {
    return database.ref('/people/' + employeename).once("value").then(function (snapshot) {
        var timestamp = new Date().getTime();
        return database.ref('visitors/' + timestamp).set({
            TimeStamp: timestamp,
            EmployeeName: employeename,
            VisitorName: visitorname,
            DeviceId: snapshot.val().DeviceId,
            ResponseStatus: 'AwaitingResponse' // (AwaitingResponse | ResponseInCall | ResponseInPerson)
        });
    });
}

/*
//How to use CreateVisitorNotification function//
CreateVisitorNotification('abuthopppppp').then(()=>{
console.log('Success');
});*/
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        let welcomeSpeech = 'Welcome to A I Singapore! I am A I Singapore\'s smart receptionist. You can talk to me and I can help you connect to the team.'
        let promptSpeech = welcomeSpeech + "  How can I help you please?"
        let repromptSpeech = 'May I know how can I help you please?';
        let cardTitle = 'Welcome to AI SINGAPORE';
        let cardContent = 'You can say phrases like \n "Connect me to ..........."';
        let imageObj = {
            smallImageUrl: 'https://aisingapore.org/wp-content/uploads/2017/09/aisingapore_hori_logo.png',
            largeImageUrl: 'https://aisingapore.org/wp-content/uploads/2017/09/aisingapore_hori_logo.png'
        };

        this.response.speak(promptSpeech)
            .listen(repromptSpeech)
            .cardRenderer(cardTitle, cardContent, imageObj);
        this.emit(':responseReady');
    },
    'UnlockDoor': function () {

        /*
        // Make the call to your device cloud for control 
        https.get('https://maker.ifttt.com/trigger/unlock_main_door/with/key/6A7LmBXJEfDtat0jEN16p', (res) => {
            res.on('data', (d) => {
                this.response.speak("Door Unlocked!");
                this.emit(':responseReady');
            });
        }).on('error', (e) => {
            this.response.speak("Door cannot be unlocked at this time. Please check manually!");
            this.emit(':responseReady');
        });*/
        this.response.speak("Door cannot be unlocked at this time. Please check manually!");
        this.emit(':responseReady');
    },
    'ConnectToEmployeeIntent': function () {
        const intentObj = this.event.request.intent
        //var employeeName = intentObj.slots["EmployeeName"].value;

        if (!intentObj.slots.EmployeeName.value) {
            const slotToElicit = 'EmployeeName';
            const speechOutput = 'I didn\'t get you. Can you please repeat the name of the person you would like to meet?';
            const repromptSpeech = speechOutput;
            this.emit(':elicitSlotWithCard', slotToElicit, speechOutput, repromptSpeech,"Who would you like to meet?","Repeat the name please..",null);
        }


        if (intentObj.slots.EmployeeName.confirmationStatus !== 'CONFIRMED') {
            if (intentObj.slots.EmployeeName.confirmationStatus !== 'DENIED') {
                let personToConnect = intentObj.slots.EmployeeName.resolutions.resolutionsPerAuthority[0].values[0].value.name;
                // slot status: unconfirmed
                const slotToConfirm = 'EmployeeName';
                const speechOutput = 'You want to connect to ' + personToConnect + ', is that right?';
                const repromptSpeech = speechOutput;
                return this.emit(':confirmSlotWithCard', slotToConfirm, speechOutput, repromptSpeech,"You want to connect to",personToConnect+". Is that right?",null);
            } else {
                // slot status: denied -> reprompt for slot data
                const slotToElicit = 'EmployeeName'
                const speechOutput = 'Who would you like to meet?'
                const repromptSpeech = 'Who would you like to meet?'
                this.emit(':elicitSlotWithCard', slotToElicit, speechOutput, repromptSpeech,"Who would you like to meet?","Repeat the name please..",null);
            }
        } else {
            CreateVisitorNotification(intentObj.slots.EmployeeName.resolutions.resolutionsPerAuthority[0].values[0].value.name).then(() => {
                //Console.log("created");
                let personToConnect = intentObj.slots.EmployeeName.resolutions.resolutionsPerAuthority[0].values[0].value.name;
                let speakContent = 'Connecting to ' + personToConnect  + '.. Please wait...';
                this.emit(':tellWithCard', speakContent, "Please wait...", "Connecting to "+personToConnect + "...", null);
            }).catch(() => {
                //Console.log("unable to create");
                let speakContent = 'Please wait for the person to respond.';
                this.emit(':tellWithCard', speakContent, "Please wait...", "Connecting inside..", null);
            });
        }

        //Console.log("Creating")

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the Hello World Sample Skill. ';
        const reprompt = 'Say hello, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    }
};

function delegateSlotCollection() {
    if (this.event.request.dialogState === "STARTED") {
        var updatedIntent = this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
    } else {
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}

function isSlotValid(request, slotName) {
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}
