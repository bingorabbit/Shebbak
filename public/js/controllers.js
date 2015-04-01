var ShebbakControllers = angular.module('ShebbakControllers', ['ngSanitize', 'twitterFilters', 'ngCookies']);

ShebbakControllers.controller('HomeController', function($scope, $rootScope, socket, $cookies, $location){
    $rootScope.setActive('home');
    if(!$cookies.loggedIn){
        $location.path('/login')
    }
    $scope.query = function(hashtag){
        console.log(hashtag)
        if(hashtag){
            if(hashtag.indexOf('#') == -1) hashtag = '#' + hashtag;
            $scope.tweets = [];

            socket.emit("q", {
                'q': hashtag,
                'access_token': $cookies.access_token,
                'access_token_secret': $cookies.access_token_secret
            });
            socket.on('tweet', function(data){
                if ($scope.tweets.length == 10){
                    $scope.tweets.pop();
                }
                $scope.tweets.unshift(data);
            });
            socket.on('disconnect', function(ev){
                console.log('##########################################################')
            });
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
    //$scope.tweets = [];
    //
    //socket.emit("Hello", {"name": "bingo"})
    //
    //socket.on('tweet', function(data){
    //    if ($scope.tweets.length == 10){
    //        $scope.tweets.pop();
    //    }
    //    $scope.tweets.unshift(data);
    //    console.log($scope.tweets.length)
    //})

});
ShebbakControllers.controller('AboutController', function($rootScope){
    $rootScope.setActive('about');
});