var express = require('express');
var http = require('http');
var moment = require('moment-timezone');

var app = express();
var server = http.Server(app);

var io = require('socket.io')(server);
var switchboard = require('rtc-switchboard')(server);


// Serve static HTML files
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/rtc.min.js', function(req, res){
  res.sendFile(__dirname + '/rtc.min.js');
});
app.get('/webcam_client.html', function(req, res){
  res.sendFile(__dirname + '/webcam_client.html');
});


// Catch errors and such
app.get('/favicon.ico', function(req, res) {
  res.sendStatus(200);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  next(err);
});


function getCurrentTime() {
  return moment().tz('America/Los_Angeles').format('M/DD/YYYY, h:mm:ss A');
}

function makeServerMessage(messageText) {
  return {
    type: "text",
    sender: "Server",
    message: messageText,
    timestamp: getCurrentTime()
  };
}


// Chat message logging
var messageLog = [];
function logChatMessage(msg) {
  messageLog.push(msg);
}


// Make socket IDs human-readable!
var socketIDs = {};
var idCounter = 0;
function setID(socketID) {
  if (socketIDs[socketID] === undefined) {
    socketIDs[socketID] = idCounter;
    idCounter += 1;
  }
}
function getID(socketID) {
  return socketIDs[socketID];
}


// Register Socket.io event handlers
io.on('connection', function(socket){
  socket.emit('connected', {
    chat: messageLog
  });

  setID(socket.id);

  // Announce new connection
  var connectMessage = makeServerMessage("Client " + getID(socket.id) + " connected!");
  socket.broadcast.emit('chat message', connectMessage);
  logChatMessage(connectMessage);

  // Pass messages between clients
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    logChatMessage(msg);
  });

  // Handle disconnections
  socket.on('disconnect', function(msg){
    var disconnectMessage = makeServerMessage("Client " + getID(socket.id) + " disconnected!");
    socket.broadcast.emit('chat message', disconnectMessage);
    logChatMessage(disconnectMessage);
  });

});



// Start the server
var port = process.env.PORT || 5000;
server.listen(port, function(){
  console.log('listening on *:%d', port);
});


