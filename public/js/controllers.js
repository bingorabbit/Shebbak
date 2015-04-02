var ShebbakControllers = angular.module('ShebbakControllers', ['ngSanitize', 'twitterFilters', 'ngCookies']);

ShebbakControllers.controller('HomeController', function($scope, $rootScope, socket, $cookies, $location){
    $rootScope.setActive('home');
    $scope.trackingFunction = function(){
        return Math.floor((Math.random()*999999999) + 100000000);
    }
    if(!$cookies.loggedIn){
        $location.path('/login')
    } else {
        $scope.query = function(hashtag){
            console.log("Hashtag:", hashtag)
            $cookies.q = hashtag;
            if(hashtag){
                if(hashtag.indexOf('#') == -1) hashtag = '#' + hashtag;
                $scope.tweets = [];
                socket.emit("q", {
                    'q': hashtag,
                    'access_token': $cookies.access_token,
                    'access_token_secret': $cookies.access_token_secret
                });
                socket.on('tweet_'+$cookies.q, function(data){
                    if ($scope.tweets.length == 10){
                        $scope.tweets.pop();
                    }
                    $scope.tweets.unshift(data);
                });
                socket.on('disconnect', function(ev){
                    console.log('Server disconnected, will try to connect..');
                });
                socket.addListener('reconnect', function(){
                    console.log('Server Back Online..Reconnecting..');
                    socket.emit("q", {
                        'q': hashtag,
                        'access_token': $cookies.access_token,
                        'access_token_secret': $cookies.access_token_secret
                    });
                })
            }
        }

        if($cookies.q){
            console.log("Session instantiated before with query:", $cookies.q);
            $scope.hashtag = $cookies.q;
            $scope.message = "Welcome back..";
            $scope.query($cookies.q);
        }
    }
});

ShebbakControllers.controller('MainController', function($scope, $rootScope, $cookies, $location){
    $rootScope.setActive('home');
    if($cookies.loggedIn){
        $location.path('/home')
    } else {
        $location.path('/login')
    }
});

ShebbakControllers.controller('LoginController', function($scope, socket){

});
ShebbakControllers.controller('AboutController', function($rootScope){
    $rootScope.setActive('about');
});