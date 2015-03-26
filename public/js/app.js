/**
 * Created by bingorabbit on 3/20/15.
 */
var ShebbakApp = angular.module('ShebbakApp', ['ShebbakServices', 'ShebbakControllers', 'ngRoute'])
    .run(function($rootScope){
        $rootScope.year = new Date().getFullYear();

        $rootScope.setActive = function (element) {
            console.log(element);
            $rootScope.home_active = false;
            $rootScope.login_active = false;
            $rootScope.contact_active = false;
            $rootScope.about_active = false;
            $rootScope[element+'_active'] = true;
        }
    });

ShebbakApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        controller: 'MainController',
        templateUrl: 'partials/content.jade'
    }).
    when('/login/', {
        controller: 'LoginController',
        templateUrl: 'partials/login.jade'
    }).
    when('/about/', {
        controller: 'AboutController',
        templateUrl: 'partials/about.jade'
    }).
    when('/contact/', {
        controller: 'ContactController',
        templateUrl: 'partials/contact.jade'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);
