// Instantiates express
var express = require('express')

// Instantiates an application
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
var fs = require('fs');
var configurationFile = "./configs.json"

var configs = JSON.parse(fs.readFileSync(configurationFile))
var Twit = require('twit')

var T = new Twit(configs.twitter)

app.set('port', process.env.PORT || configs.PORT_LISTENER);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public/'));

io.on('connection', function(socket){
    socket.on('Hello', function(data){
        var stream = T.stream('statuses/filter', {
            track: "مصر"
        });
        stream.on('tweet', function(tweet){
            console.log(tweet.text);
            socket.emit('tweet', tweet);
        });
        stream.on('disconnect', function (disconnectMessage) {
            console.log("Stream disconnected with error message: " + disconnectMessage);
            stream.start();
        });
        stream.on('error', function(error){
            console.log("Error happened: " + error);
        });
    })
});

app.get("/", function(req, res){
    res.render('index')
});

server.listen(app.get('port'), function(req, res){
    console.log("Listening on port: " + app.get('port'));
})