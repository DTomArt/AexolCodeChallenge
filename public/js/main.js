"use strict";
//get the data from the document from inputs recognizing them by their id
var senderInput = document.getElementById('from');
var numberInput = document.getElementById('number');
var textInput = document.getElementById('msg');
var button = document.getElementById('button'); //! don't worry ts, there is button somewhere
var response = document.querySelector('.response');
//when the button is clicked, function send is called
button.addEventListener('click', send, false);
//we can use it thanks to path to script, which we placed in index.html 
//(client-side)
var socket = io();
socket.on('smsStatus', function (data) {
    console.log(data);
    if (data) {
        response.innerHTML = '<h5>Text message sent to ' + data + '</h5>';
    }
    else { //^change HTML called 'response'
        response.innerHTML = '<h5>An error occurred!</h5>';
    }
});
function send() {
    var number = numberInput.value.replace(/\D/g, '');
    //we use the value of a numberInput, so the number and call function to replace
    //non-numeric signs \D - characters other than digits, /g - every occurence, 
    //'' - replace to basically nothing, empty string 
    var text = textInput.value;
    var sender = senderInput.value;
    //same but without replacing, there is no need for it
    //request to index, that's why it's '/', it's post request, so we want to specify the object
    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json' //object notation JavaScript, additional METADATE
        },
        body: JSON.stringify({ sender: sender, number: number, text: text })
        //content of a request will be converted from JSON to string
    })
        .then(function (res) {
        console.log(res);
    })
        .catch(function (err) {
        console.log(err);
    });
}
