var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jade = require('jade');


app.use(express.static('src/assets/'));

app.get('/', (req,res) => {
    var html = jade.renderFile('src/index.jade');
    res.send(html);
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
})