var express = require('express');
var http = require('http');
var moment = require('moment-timezone');

var app = express();
var server = http.Server(app);

var io = require('socket.io')(server);


// Serve static HTML files
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
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
  return moment().tz('America/Los_Angeles').format('M/DD/YYYY H:mm:ss A');
}


// Register Socket.io event handlers
io.on('connection', function(socket){
  socket.emit('connected');
  socket.broadcast.emit('chat message', {
      type: "text",
      sender: "Server",
      message: "Someone else connected!",
      timestamp: getCurrentTime()
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(msg){
    socket.broadcast.emit('chat message', {
      type: "text",
      sender: "Server",
      message: "Someone else disconnected!",
      timestamp: getCurrentTime()
    });
  });
});



// Start the server
var port = process.env.PORT || 5000;
server.listen(port, function(){
  console.log('listening on *:%d', port);
});


