var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('src/assets/'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/src/index.html')
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
})