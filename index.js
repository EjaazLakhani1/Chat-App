var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

users = {};
messages = [];
people = []

io.on('connection', (socket) => {
    
    var userCmd = '/'
    var nameCmd = "/name ";
    var colourCmd = "/color "
    var smile = ":)";
    var wow = ":o";
    var frown = ":("

    var n = 0;
    var color;
    n++;
    var person;
    var ppl;
    var clr = '#000000';

    socket.on('new-user',(name) => {
        people.push[name];
        users[socket.id] = name;
        person = name + Math.floor(Math.random() * 100);
        socket.emit('user-connected', person + " (YOU)");
        socket.broadcast.emit('user-connected', person);
        for (let i = 0; i < messages.length; ++i) {
            socket.emit('load message', messages[i]);    
        }
        for (let i = 0; i < people.length; ++i) {
            socket.emit('user-connected', people[i]);
        }
    }) 



    socket.on('chat message', (msg) => {

        const smileEmoji = '\uD83D\uDE01';
        const wowEmoji = '\uD83D\udE32';
        const frownEmoji = '\uD83D\udE41'

        if (msg.startsWith(userCmd)) {
            if (msg.startsWith(nameCmd)) {
                var str = msg.replace(nameCmd,'')
                if (people.includes(str)) {
                }
                else {
                    person = str;
                    socket.emit('user-connected', person + " (YOU)");
                    socket.broadcast.emit('user-connected', person);
                }
            }
            if (msg.startsWith(colourCmd)) {
                color = msg.replace(colourCmd,'');
                clr ='#'+color;
                console.log(clr);
            }
        }
        
        else {
            while (msg.includes(smile) || msg.includes(wow) || msg.includes(frown)) {
                msg = msg.replace(smile,smileEmoji);
                msg = msg.replace(wow,wowEmoji);
                msg = msg.replace(frown,frownEmoji);
            }
            people.push(person);
            var mess = new Date().toLocaleTimeString() + "    " + person + ":  " + msg;
            var selfmess = new Date().toLocaleTimeString() + "    " + person + " (You):  " + msg;
            var mr = mess;
            socket.emit('chat message', {message: selfmess, textcolor: clr, fontweight: 'bold'})
            socket.broadcast.emit('chat message', {message: mess, textcolor: clr, fontweight: 'normal'})
            messages.push(mr);
        }
     
    });

    socket.on('disconnect', () =>{
        for (let i = 0; i < people.length; i++) {
            if (people[i] == person) {
                delete people[i];
            }
        }
        delete users[socket.id]
        socket.broadcast.emit('user-connected', people);
    });

});


http.listen(3000, () => {
    console.log('listening on *:3000');
});
