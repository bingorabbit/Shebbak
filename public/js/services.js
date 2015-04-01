/**
 * Created by bingorabbit on 3/21/15.
 */
var ShebbakServices = angular.module('ShebbakServices', ['btford.socket-io']);

ShebbakServices.factory('socket', function(socketFactory){
    return socketFactory({
        ioSocket: io.connect(window.location.host)
    });
});