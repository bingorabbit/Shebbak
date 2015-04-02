// Instantiates express
var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')

// Instantiates an application
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
var no_of_sockets = 0; // To hold number of currently opened sockets.
var application_streams = {}

// Instantiates Twitter client
var Twit = require('twit')

// Instantiates OAuth
var OAuth = require('oauth').OAuth;

// Get, read and parse Configuration File
var fs = require('fs');
var configurationFile = "./configs.json"
// Tries in development environment
try {

    var configs = JSON.parse(fs.readFileSync(configurationFile));
}
// For heroku deployment
catch (e){
    var configs = {
        "twitter": {
            "consumer_key": process.env.consumer_key,
            "consumer_secret": process.env.consumer_secret
        },
        "PORT_LISTENER": 3000,
        "callback_url": "https://shebbak.herokuapp.com/auth/callback/"
    };
    console.log(e)
}

// Generates a guid for sessions.
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

app.set('port', process.env.PORT || configs.PORT_LISTENER);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.locals.pretty = true;

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public/'));
app.use(cookieParser())
app.use(session({
    secret: guid(),
    resave: true,
    saveUninitialized: true
}));
// Once out client is connected to our backend, let's start our application logic.
io.on('connection', function(socket){
    application_streams[socket.id] = {};
    console.log("A new socket instantiated with ID:", socket.id, "Current number of sockets currently up:", io.sockets.sockets.length);
    console.log("Current sockets IDs:", Object.keys(io.sockets.connected).join(", "));
    socket.on('q', function(data){
        console.log(application_streams);
        if(!application_streams[socket.id].stream){
            console.log("Socket ID:", socket.id, "started a new hashtag query:", data.q);
            var T = new Twit({
                "consumer_key": configs.twitter.consumer_key,
                "consumer_secret": configs.twitter.consumer_secret,
                "access_token": data.access_token,
                "access_token_secret": data.access_token_secret
            });
            var stream = T.stream('statuses/filter', {
                track: data.q
            });
            application_streams[socket.id]['stream'] = stream;
            stream.on('tweet', function(tweet){
                console.log('Received a new', data.q, 'tweet with tweet ID:', tweet.id_str);
                socket.emit('tweet_'+data.q.slice(1), tweet);
            });
            stream.on('limit', function(limitMessage) {
                console.log('Limit for User: ' + socket.id + ' on query ' + data.q + ' has rechead!');
            });
            stream.on('warning', function(warning) {
                console.log('Warning:', warning);
            });
            // https://dev.twitter.com/streaming/overview/connecting
            stream.on('reconnect', function(request, response, connectInterval) {
                console.log('Reconnecting :: connectInterval:', connectInterval)
            });
            // Disconnected from twitter..
            stream.on('disconnect', function (disconnectMessage) {
                console.log("Stream disconnected with error message: " + disconnectMessage);
            });
            stream.on('error', function(error){
                console.log(data.q, "Error: ", error.message);
                stream.stop();
                setTimeout(function(){
                    stream.start();
                }, 5000)
            });
        }

        socket.on('disconnect', function(ev){
            no_of_sockets -= 1;
            console.log("Client", socket.id, "disconnected with message:", ev);
            try {
                if (application_streams[socket.id].stream) {
                    application_streams[socket.id].stream.stop()
                }
                delete application_streams[socket.id];
                console.log('Removed All Search from user >>', socket.id);
            }
            catch (e) {
                console.log("This is not supposed to happen, tried to disconnect an application socket stream that wasn't found.")
            }
        });
        socket.on('remove', function(ev){
            console.log("Client", socket.id, "is changing his search query.");
            try {
                application_streams[socket.id].stream.stop();
                delete application_streams[socket.id].stream;
            } catch (e) {
                console.log("This is not supposed to happen, tried to delete an application socket stream that wasn't found.")
            }
        });
        socket.on('reconnecting', function(ev){
            console.log('RECONNECTING:', ev)
            var T = '';
            application_streams[socket.id]['stream'].stop();
        });
    });
});
function get_oa(req){
    var oa = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        configs.twitter.consumer_key,
        configs.twitter.consumer_secret,
        "1.0",
        req.protocol + '://' + req.get('host') + req.originalUrl.replace('twitter', 'callback'),
        "HMAC-SHA1"
    );
    return oa;
}
app.get('/auth/twitter', function (req, res) {
    oa = get_oa(req);
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
    oa = get_oa(req);
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