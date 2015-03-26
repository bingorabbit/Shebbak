var ShebbakControllers = angular.module('ShebbakControllers', ['ngSanitize', 'twitterFilters']);

ShebbakControllers.controller('MainController', function($scope, $rootScope, socket){
    $rootScope.setActive('home');
    $scope.tweets = [];

    console.log(socket);
    console.log(io.socket)

    socket.emit("Hello", {"name": "bingo"})
    socket.on('tweet', function(data){
        if ($scope.tweets.length == 10){
            $scope.tweets.pop();
        }
        $scope.tweets.unshift(data);
    });
    socket.on('disconnect', function(ev){
        console.log('##########################################################')
    });

});

ShebbakControllers.controller('LoginController', function($scope, socket){
    $scope.tweets = [];

    socket.emit("Hello", {"name": "bingo"})

    socket.on('tweet', function(data){
        if ($scope.tweets.length == 10){
            $scope.tweets.pop();
        }
        $scope.tweets.unshift(data);
        console.log($scope.tweets.length)
    })

});
ShebbakControllers.controller('AboutController', function($rootScope){
    $rootScope.setActive('about');
});
ShebbakControllers.controller('ContactController', function($rootScope){
    $rootScope.setActive('contact')
});