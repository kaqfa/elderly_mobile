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

.controller('DashCtrl', function($scope, Elders, $state) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.$on('$ionicView.beforeEnter', function(){
    if(localStorage.getItem('token') === null)
      $state.go('login')
  })
  $scope.logout = function(){
    localStorage.removeItem('token');
    $state.go('login');
  }

})

.controller('KondisiCtrl', function($scope, Elders, $state) {
  
})

.controller('AnatomiCtrl', function($scope, Anatomy, $state) {
  $scope.imgs=Anatomy.getData();
  $scope.changeImg=function(image){
    Anatomy.show(image);
  }
})