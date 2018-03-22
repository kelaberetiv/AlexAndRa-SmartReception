// Initialize Firebase DB
var config = {
    apiKey: "AIzaSyADf9J0ND1fSEOskvu-W7yyJBzieSRO8lI",
    authDomain: "alexandra-smart-reception.firebaseapp.com",
    databaseURL: "https://alexandra-smart-reception.firebaseio.com",
    projectId: "alexandra-smart-reception",
    storageBucket: "",
    messagingSenderId: "771766531274"
};
firebase.initializeApp(config);
var database = firebase.database();
var deviceRef = database.ref('devices');
var peopleRef = database.ref('people');

var AlexaSchemaJson_Types_EmployeeNames_Values = [];
var AlexaSchemaJson_Types_EmployeeNames = {}
var AlexaSchemaJson_Types_Values = [];

//Fill devices table in the page
deviceRef.on("child_added", function (snap) {
    console.log(snap.key)
    $('#DeviceId').append(
        $('<option></option>').val(snap.val().AlexaDeviceId).html(snap.val().AlexaDeviceName + "(" + snap.val().AlexaDeviceId + ")"));
    deviceTableHtmlFromObject(snap.key, snap.val());
});

//Prepare Alexa JSON schema from people name
peopleRef.on("child_added", function (snap) {
    console.log(snap.key)
    peopleTableHtmlFromObject(snap.key, snap.val());
    AlexaSchemaJson_Types_EmployeeNames_Values.push(createAlexaSchemaJsonObjFromObject(snap.val()));
    AlexaSchemaJson_Types_EmployeeNames.name = "EmployeeNames";
    AlexaSchemaJson_Types_EmployeeNames.values = AlexaSchemaJson_Types_EmployeeNames_Values;
    AlexaSchemaJson_Types_Values = [];
    AlexaSchemaJson_Types_Values.push(AlexaSchemaJson_Types_EmployeeNames)
    document.getElementById("jsonCode").innerHTML = JSON.stringify(AlexaSchemaJson_Types_Values, undefined, 2);
});

//Add device data to db
document.querySelector('.updateDevice').addEventListener("click", function (event) {
    event.preventDefault();
    if (document.querySelector('#alexaDeviceName').value != '' || document.querySelector('#alexaDeviceId').value != '') {
        deviceRef.push({
            AlexaDeviceName: document.querySelector('#alexaDeviceName').value,
            AlexaDeviceId: document.querySelector('#alexaDeviceId').value,
        });
        deviceForm.reset();
    } else {
        alert('Some required fields have missing values!!');
    }
}, false);

//Delete a device
function deleteDeviceItem(button) {
    if (confirm('Are you sure?')) {
        var id = button.getAttribute("data-id");
        var deviceRef = database.ref('devices/' + id).set(null);
        $("#tblDevices" + id).remove();
    }
}

//Create device data rows
function deviceTableHtmlFromObject(key, deviceObject) {
    var row = $("<tr id='tblDevices" + key + "'>");
    row.append($("<td>" + deviceObject.AlexaDeviceName + "</td>"))
        .append($("<td>" + deviceObject.AlexaDeviceId + "</td>"))
        .append($('<td><button type="button" class="btn btn-danger btn-sm" onclick="deleteDeviceItem(this)" data-id="' + key + '"><span class="fa fa-trash"></span></button></td>'))
    $("#tblDevices tbody").append(row);
}

//Add a person data to db
document.querySelector('.updatePersonData').addEventListener("click", function (event) {
    event.preventDefault();
    if (document.querySelector('#personName').value != '') {
        database.ref('people/' + document.querySelector('#personName').value).set({
            PersonName: document.querySelector('#personName').value,
            MobileNo: document.querySelector('#MobileNo').value,
            NameUtteranceSamples: document.querySelector('#NameUtteranceSamples').value,
            DeviceId: document.querySelector('#DeviceId').value,
        });
        personDataForm.reset();
    } else {
        alert('Some required fields have missing values!!');
    }
}, false);

//Delete a person data
function deletePeopleItem(button) {
    if (confirm('Are you sure?')) {
        var id = button.getAttribute("data-id");
        var peopleRef = database.ref('people/' + id).set(null);
        $("#tblPeople" + id).remove();
    }
}

//Create person data rows
function peopleTableHtmlFromObject(key, personObject) {
    var row = $("<tr id='tblPeople" + key + "'>");
    row.append($("<td>" + personObject.PersonName + "</td>"))
        .append($("<td>" + personObject.MobileNo + "</td>"))
        .append($("<td>" + personObject.NameUtteranceSamples + "</td>"))
        .append($("<td>" + personObject.DeviceId + "</td>"))
        .append($('<td><button type="button" class="btn btn-danger btn-sm" onclick="deletePeopleItem(this)" data-id="' + key + '"><span class="fa fa-trash"></span></button></td>'))
    $("#tblPeople tbody").append(row);
}

//Create Alexa Schema JSON
function createAlexaSchemaJsonObjFromObject(personObject) {
    console.log("peopledata", personObject);
    var obj = {};
    obj.id = '';
    var name_obj = {};
    name_obj.value = personObject.PersonName;
    name_obj.synonyms = personObject.NameUtteranceSamples.split(",");
    obj.name = name_obj;
    return obj;
}
