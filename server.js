// Instantiates express
var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

// Instantiates an application
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)

// Configuration File
var fs = require('fs');
var configurationFile = "./configs.json"
try {
    fs.readFileSync(configurationFile, 'utf8', function(error, data){
            if (!error){
                    var configs = JSON.parse(data)
                    } else {
                    console.log("Configuration file not found.");
                }
        })
}
catch (e){
        var configs = {
                "twitter": {
                    "consumer_key": process.env.consumer_key,
                        "consumer_secret": process.env.consumer_secret
                },
            "PORT_LISTENER": 3000
        };
    console.log(e)
}


var Twit = require('twit')

var OAuth = require('oauth').OAuth;
var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    configs.twitter.consumer_key,
    configs.twitter.consumer_secret,
    "1.0",
    "http://localhost:3000/auth/callback/",
    "HMAC-SHA1"
);

app.set('port', process.env.PORT || configs.PORT_LISTENER);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(express.static(__dirname + '/public/'));
app.use(cookieParser())
app.use(session({
    secret: guid(),
    resave: true,
    saveUninitialized: true
}));

io.on('connection', function(socket){
    socket.on('q', function(data){

        var T = new Twit({
            "consumer_key": configs.twitter.consumer_key,
            "consumer_secret": configs.twitter.consumer_secret,
            "access_token": data.access_token,
            "access_token_secret": data.access_token_secret
        });
        if(stream) {
            stream.stop();
        }
        var stream = T.stream('statuses/filter', {
            track: data.q
        });
        console.log(data.q);
        stream.on('tweet', function(tweet){
            console.log('Received a new tweet..');
            socket.emit('tweet', tweet);
        });
        stream.on('disconnect', function (disconnectMessage) {
            console.log("Stream disconnected with error message: " + disconnectMessage);
        });
        stream.on('error', function(error){
            console.log("Error: ", error);
            stream.stop();
            stream.start();
        });

        socket.on('disconnect', function(ev){
            console.log('DISCONNECTED', ev);
            stream.stop();
        });
        socket.on('reconnecting', function(ev){
            console.log('RECONNECTING:', ev)
        })
    });
});

app.get('/auth/twitter', function (req, res) {
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
            res.send("yeah no. didn't work.")
        } else {
            res.cookie('loggedIn', true);
            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            console.log('oauth.token: ' + req.session.oauth.token);
            req.session.oauth.token_secret = oauth_token_secret;
            console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
        }
    });
});
// Callback service parsing the authorization token and asking for the access token
app.get('/auth/callback', function (req, res) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log(error);
                res.send("yeah something broke.");
            } else {
                res.cookie('loggedIn', true);
                res.cookie('access_token', oauth_access_token)
                res.cookie('access_token_secret', oauth_access_token_secret)
                req.session.oauth.access_token = oauth_access_token;
                req.session.oauth, access_token_secret = oauth_access_token_secret;
                res.redirect('/')
            }
        }
    );
});

app.get("/", function (req, res) {
    res.render('index')
});
app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render(name);
});
server.listen(app.get('port'), function (req, res) {
    console.log("Listening on port: " + app.get('port'));
})