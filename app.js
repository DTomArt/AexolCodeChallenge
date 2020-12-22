"use strict";
//bring up dependencies
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var Nexmo = require('nexmo');
var socketio = require('socket.io');
//initializing nexmo
var nexmo = new Nexmo({
    apiKey: 'apiKeyFromNexmo',
    apiSecret: 'apiSecretFromNexmo',
});
//initializing app
var app = express();
//template
app.set('view engine', 'html'); //app.set(name, value) - Assigns setting name to value
app.engine('html', ejs.renderFile); //mapping the EJS template engine to “.html” files
//public folder setup
app.use(express.static(__dirname + '/public'));
//to serve images, CSS files, and JavaScript files in a directory named public
//standard setting body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Index route ('/' for rooth path)
app.get('/', function (req, res) {
    res.render('index'); //compiling template, inserting locals and creating html output
});
//Catch form submit, catch on the server side
//app.post(path, callback [, callback ...]) function routes the HTTP POST requests to the specified path with the specified callback functions
app.post('/', function (req, res) {
    // res.send(req.body);
    // console.log(req.body);  //we send body to console to check if everything's alright
    var sender = req.body.sender;
    var number = req.body.number;
    var text = req.body.text;
    //nexmo.message.sendSms(from, to, text);
    nexmo.message.sendSms(sender, number, text, { type: 'unicode' }, function (err, responseData) {
        if (err) { //in case of error
            console.log(err);
        }
        else {
            console.dir(responseData); //the data will be displayed in console
            if (responseData.messages[0]['status'] == 0) //if status is 0, then message have been succesfully send
             {
                var number_1 = responseData.messages[0]['to']; //to whom message is send
                io.emit('smsStatus', number_1); // Emit to the client
            }
            else
                io.emit('smsStatus', 0);
        }
    });
});
//Define port
var port = 3000;
//start server
var server = app.listen(port, function () {
    console.log('app listening on port ' + port);
});
//connect to socket.io(server-side)
var io = socketio(server);
io.on('connection', function (socket) {
    console.log('Connected', socket.id); //we inform about it on console
    io.on('disconnect', function () {
        console.log('Disconnected');
    });
});
