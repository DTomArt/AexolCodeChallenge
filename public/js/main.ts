//get the data from the document from inputs recognizing them by their id
const senderInput = (<HTMLInputElement>document.getElementById('from'));
const numberInput = (<HTMLInputElement>document.getElementById('number'));
const textInput = (<HTMLInputElement>document.getElementById('msg'));
const button = document.getElementById('button')!;  //! don't worry ts, there is button somewhere
const response = document.querySelector('.response')!;

//when the button is clicked, function send is called
button.addEventListener('click', send, false);

//we can use it thanks to path to script, which we placed in index.html 
//(client-side)
const socket = io();
socket.on('smsStatus', function(data : any){
    console.log(data);
    if(data){
        response.innerHTML = '<h5>Text message sent to ' + data + '</h5>';
    } else {    //^change HTML called 'response'
    response.innerHTML = '<h5>An error occurred!</h5>';
    }   
})

function send() {
    const number = numberInput.value.replace(/\D/g, ''); 
    //we use the value of a numberInput, so the number and call function to replace
    //non-numeric signs \D - characters other than digits, /g - every occurence, 
    //'' - replace to basically nothing, empty string 
    const text = textInput.value;
    const sender = senderInput.value;
    //same but without replacing, there is no need for it

    //request to index, that's why it's '/', it's post request, so we want to specify the object
    fetch('/',{
        method: 'post', //defining a method: POST - create a new resource
        headers: {      //setting appropriate headers, what kind of data will we gain
            'Content-type': 'application/json'  //object notation JavaScript, additional METADATE
        },
        body: JSON.stringify({sender : sender, number: number, text: text}) 
        //content of a request will be converted from JSON to string
    })
    .then(function(res){    //let's write a response in a console
        console.log(res);
    })
    .catch(function(err){   //if there is an error we'll catch him and show
        console.log(err);
    });
}