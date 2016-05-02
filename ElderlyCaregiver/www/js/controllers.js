angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, Users, Elders, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!Users.cekLogin())
      $state.go('login')
  })
  $scope.elders=Elders.all();
  $scope.logout = function(){
    Users.logout();
    $state.go('login');
  }

})

.controller('LoginCtrl', function($scope, Users, Elders, $state, $ionicPopup, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(Users.cekLogin())
      $state.go('app.dashboard');
  })
  $scope.user={
    username:"",
    password:""
  }
  $scope.login = function(user){
    if(user.$valid){
      $ionicLoading.show({
        template: 'Loading...'
      })
      Users.login($scope.user.username, $scope.user.password, function(data){
        //Users.setData(data.token);
        Elders.setAll(data.token, function(data){
          $ionicLoading.hide();
          $state.go('app.dashboard');
        }, function(response){
          $ionicLoading.hide();
          var msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        });
      },function(response){
        $ionicLoading.hide();
        var msg="";
        if(response.status==400){
          msg="Username atau password salah";
        }else{
          msg="Koneksi gagal";
        }
        $ionicPopup.alert({
         title: 'Error',
         template: msg
        });
      });
      /*
      if(token){
        localStorage.token = token;
        $state.go('app.dashboard')
      }
      */
    }
  };
})

.controller('RegCtrl', function($scope, Users, Elders, $state, $ionicPopup, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(Users.cekLogin())
      $state.go('app.dashboard')
  })
  $scope.user={
    fullname:"",
    email:"",
    username:"",
    password:"",
    repass:"",
    phone:"",
    gender:"l"
  }
  $scope.passMatch = true;
  $scope.isMatch=function(){
    if($scope.user.password==$scope.user.repass){
      $scope.passMatch = true;
    }else{
      $scope.passMatch = false;
    }
  }
  $scope.register = function(user){
    fail=function(msg){
      $ionicPopup.alert({
       title: 'Error',
       template: msg
      });
    }
    if(user.$valid&&$scope.passMatch){
      $ionicLoading.show({
        template: 'Loading...'
      })
      Users.register($scope.user,function(data){
        Users.login($scope.user.username, $scope.user.password, function(data){
          Elders.setAll(data.token, function(data){
            $ionicLoading.hide();
            $state.go('app.dashboard');
          }, function(response){
            $ionicLoading.hide();
            var msg="Koneksi gagal";
            fail(msg);
          });
        }, function(response){
          $ionicLoading.hide();
          var msg="Koneksi gagal";
          fail(msg);
        })
      },function(response){
        $ionicLoading.hide();
        var msg="";
        if(response.status==400){
          msg="Username sudah terpakai";
        }else{
          msg="Koneksi gagal";
        }
        fail(msg);
      });
    }
  };
})

.controller('regParentCtrl', function($scope, Users, Elders, $state, $ionicPopup, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!Users.cekLogin())
      $state.go('login')
  })
  $scope.user={
    fullname:"",
    birthdate:"",
    phone:"",
    gender:"l"
  }
  $scope.register = function(user){
    console.log($scope.user);
  };
})

.controller('ParentCtrl', function($scope, Elders, $stateParams) {
  $scope.elder=Elders.get($stateParams.parentId);
});
