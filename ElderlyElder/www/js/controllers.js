angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, Elders, $state) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(localStorage.getItem('token') !== null)
      $state.go('dashboard')
  })
  $scope.user={
    username:"",
    password:""
  }
  $scope.login = function(user){
    if(user.$valid){
      var token=Elders.login($scope.user.phone);
      if(token){
        localStorage.token = token;
        $state.go('dashboard')
      }
    }
  };
})
