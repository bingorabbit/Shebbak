/**
 * Created by bingorabbit on 3/20/15.
 */
var ShebbakApp = angular.module('ShebbakApp', ['ShebbakServices']);

ShebbakApp.controller('MainController', function($scope, socket){

    console.log(socket);

    socket.emit("Hello", {"name": "bingo"})
    socket.on('HelloBack', function(data){
        alert("Recieved Hello Back");
    })

    $scope.tweets = [
        {
            'tweet_username': 'bingorabbit',
            'tweet': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'tweet_info': '6:11pm · 19 Mar 2015',
            'tweet_user_img': "http://placehold.it/75x75"
        },
        {
            'tweet_username': 'bingorabbit',
            'tweet': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'tweet_info': '6:11pm · 19 Mar 2015',
            'tweet_user_img': "http://placehold.it/75x75"
        },
        {
            'tweet_username': 'bingorabbit',
            'tweet': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'tweet_info': '6:11pm · 19 Mar 2015',
            'tweet_user_img': "http://placehold.it/75x75"
        },
        {
            'tweet_username': 'bingorabbit',
            'tweet': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'tweet_info': '6:11pm · 19 Mar 2015',
            'tweet_user_img': "http://placehold.it/75x75"
        }
    ]
});