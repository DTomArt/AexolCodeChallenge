//bring up dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//initializing nexmo
const nexmo = new Nexmo({
    apiKey: 'apiKeyFromNexmo', 
    apiSecret: 'apiSecretFromNexmo', 
  });

//initializing app
const app = express();

//template
app.set('view engine', 'html'); //app.set(name, value) - Assigns setting name to value
app.engine('html', ejs.renderFile) //mapping the EJS template engine to “.html” files

//public folder setup
app.use(express.static(__dirname + '/public'));
    //to serve images, CSS files, and JavaScript files in a directory named public

//standard setting body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index route ('/' for rooth path)
app.get('/', (req : any, res : any) => {
    res.render('index');    //compiling template, inserting locals and creating html output
})

//Catch form submit, catch on the server side
//app.post(path, callback [, callback ...]) function routes the HTTP POST requests to the specified path with the specified callback functions
app.post('/', (req : any, res : any) => {
    // res.send(req.body);
    // console.log(req.body);  //we send body to console to check if everything's alright
    const sender : string = req.body.sender;
    const number : string = req.body.number;
    const text : string = req.body.text;

    //nexmo.message.sendSms(from, to, text);
    nexmo.message.sendSms(
        sender, number, text, { type: 'unicode' },
        (err: object, responseData: any) => { 
            if(err) {       //in case of error
                console.log(err);
            } else {        
                 console.dir(responseData); //the data will be displayed in console
                if(responseData.messages[0]['status'] == 0) //if status is 0, then message have been succesfully send
                {
                    const number = responseData.messages[0]['to']     //to whom message is send
                    io.emit('smsStatus', number);       // Emit to the client
                } else  io.emit('smsStatus', 0);
            }
        })
})

//Define port
const port = 3000;
//start server
const server = app.listen(port, () =>{      //function to let us know that everything is ok
    console.log('app listening on port ' + port );
})

//connect to socket.io(server-side)
const io = socketio(server);
io.on('connection', (socket : any) => {       //connection is established
        console.log('Connected', socket.id);       //we inform about it on console
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})