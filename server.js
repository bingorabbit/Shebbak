// Instantiates express
var express = require('express')

// Instantiates an application
var app = express();

var PORT_LISTENER = 3000;
app.set('port', process.env.PORT || PORT_LISTENER);

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public/'));

app.get("*", function(req, res){
    res.render('index')
});

app.listen(app.get('port'), function(req, res){
    console.log("Listening on port: " + app.get('port'));
})