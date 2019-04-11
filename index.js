var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./src/conf/redis')(io);

app.get('/', function(req, res) {
   res.sendFile(__dirname+ '/public/index.html');
});

app.use("static", express.static(__dirname+"/public"));

users = [];
io.use((socket, next) => {
    console.log("socker.request-->", socket.request.headers);
    return next();
  //  next(new Error('Authentication error'));
});

io.use((socket, next) => {
    let token = socket.handshake.query.token;
    console.log("token-->", token);
    if (token) {
      return next();
    }
    return next(new Error('authentication error'));
  });

io.on('connection', function(socket) {

   console.log('A user connected');
   console.log("Socket properties", Object.keys(socket));
   
   socket.on('setUsername', function(data) {
        console.log("data--> ", data);
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
        socket.username=data;  
        socket.broadcast.emit("connected",{username:socket.username, id: socket.id});  
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   socket.on("disconnect",function(){
       socket.broadcast.emit("disconnected",{username:socket.username, id:socket.id});
   })
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});