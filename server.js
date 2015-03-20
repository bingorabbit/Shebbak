// Instantiates express
var express = require('express')

// Instantiates an application
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)

var PORT_LISTENER = 3000;
app.set('port', process.env.PORT || PORT_LISTENER);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public/'));

io.on('connection', function(socket){
    socket.on('Hello', function(data){
        socket.emit('HelloBack')
    })
});

app.get("/", function(req, res){
    res.render('index')
});

server.listen(app.get('port'), function(req, res){
    console.log("Listening on port: " + app.get('port'));
})