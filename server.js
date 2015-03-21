// Instantiates express
var express = require('express')

// Instantiates an application
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
var fs = require('fs');
var configurationFile = "./configs.json"

var configs = JSON.parse(
                fs.readFileSync(configurationFile)
                )
console.log(configs.twitter.consumer_key)
var Twit = require('twit')

var T = new Twit({
    consumer_key: configs.twitter.consumer_key,
    consumer_secret: configs.twitter.consumer_secret,
    access_token: configs.twitter.access_token,
    access_token_secret: configs.twitter.access_token_secret
})

var PORT_LISTENER = 3000;
app.set('port', process.env.PORT || PORT_LISTENER);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public/'));

io.on('connection', function(socket){
    socket.on('Hello', function(data){
        var stream = T.stream('statuses/filter', {
            track: "#egypt"
        });
        stream.on('tweet', function(tweet){
            console.log(tweet.text);
            //socket.emit('tweet', tweet);
        })
    })
});

app.get("/", function(req, res){
    res.render('index')
});

server.listen(app.get('port'), function(req, res){
    console.log("Listening on port: " + app.get('port'));
})