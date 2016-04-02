angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, Elders, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.$on('$ionicView.beforeEnter', function(){
    if(localStorage.getItem('token') === null)
      $state.go('login')
  })
  $scope.elders=Elders.all();
  $scope.logout = function(){
    localStorage.removeItem('token');
    $state.go('login');
  }

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('LoginCtrl', function($scope, Users, $state) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(localStorage.getItem('token') !== null)
      $state.go('app.dashboard')
  })
  $scope.user={
    username:"",
    password:""
  }
  $scope.login = function(user){
    if(user.$valid){
      var token=Users.login($scope.user.username, $scope.user.password);
      if(token){
        localStorage.token = token;
        $state.go('app.dashboard')
      }
    }
  };
})

.controller('RegCtrl', function($scope, Users, $state) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(localStorage.getItem('token') !== null)
      $state.go('app.dashboard')
  })
  $scope.user={
    name:"",
    email:"",
    username:"",
    password:"",
    repass:"",
    phone:"",
    gender:"L"
  }
  $scope.register = function(user){
    if(user.$valid){
      var token=Users.register($scope.user);
      if(token){
        localStorage.token = token;
        $state.go('app.dashboard')
      }
    }
  };
})

.controller('ParentCtrl', function($scope, Elders, $stateParams) {
  $scope.elder=Elders.get($stateParams.parentId);
});
