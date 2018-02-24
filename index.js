var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jade = require('jade');

app.use(express.static('src/assets/'));

app.get('/', (req,res) => {
    var html = jade.renderFile('src/index.jade');
    res.send(html);
});

var users = [];

io.on('connection', (socket) => {
    // 监听发送消息
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    // 监听添加用户
    socket.on('addUser', (msg) => {
        for(let i =0; i< users.length; i++){
            if(users[i].username === msg.username){
                io.emit('addUser error',users);
                return false;
            }
        }
        users.push({
            username: msg.username,
            useravatar: msg.useravatar
        });
        io.emit('addUser success',msg);
    });
    // 监听在线用户
    socket.on('show online', (msg) => {
        io.emit('show online',users);
    });
    // 监听用户进出
    socket.on('userEO', (msg) => {
        io.emit('userEO', msg);
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
})