var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 5000;

// create the switchboard
var switchboard = require('rtc-switchboard')(server);

// we need to expose the primus library


app.get('/rtc.min.js', function(req, res){
  res.sendFile(__dirname + '/rtc.min.js');
});
app.get('/', function(req, res){
  res.sendFile(__dirname + '/webcam_client.html');
});


server.listen(port, function(err) {
  if (err) {
    return;
  }

  console.log('server listening on port: ' + port);
});
