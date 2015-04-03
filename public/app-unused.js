'use strict';

// Declare app level module which depends on views, and components

//ANCIENNE version
//angular.module('myApp', [
//var app = angular.module('myApp', [
var app = angular.module('app', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ngTouch',
  'swipe'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.controller('AppCtrl', function AppCtrl($scope) {
  $scope.swipe = function($event) {
    console.log($event);
  };
})
