var _ = require('lodash');

//var socket = require('socket.io-client')('http://cs210a.herokuapp.com')
var socket = require('socket.io-client')('http://localhost:5000');

socket.on('connected', function(data) {
  data.chat.forEach(function(msg) {
    console.log(msg.sender + ': ' + msg.message);
  });
})
socket.on('disconnect', function() {
  console.log('Sockets: Disconnected from server.');
});
socket.on('reconnecting', function() {
  console.log('Sockets: Reconnecting to server...');
});
socket.on('reconnect_failed', function() {
  console.log('Sockets: Couldn\'nt reconnect to server.');
});
socket.on('chat message', function(msg) {
  console.log(msg.sender + ': ' + msg.message);
});

var clientId = _.random(100);

var number = 0;
setInterval(function() {
  if (socket.connected) {
    number = number + 1;
    console.log('Telling server our new favorite number: ', number);
    var d = new Date();
    socket.emit('chat message', {
      type: 'text',
      sender: 'Test client ' + clientId,
      message: 'Our new favorite number is ' + number,
      timestamp: d.toLocaleString()
    });
  }
}, 2000);

 
