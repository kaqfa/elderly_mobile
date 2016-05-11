angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory, Elders, $state) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(Elders.cekLogin()){
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('dashboard');
    }
    else if(localStorage.getItem("token")!==null){
      $scope.noToken=false;
      $ionicLoading.show({
        template: 'Loading...'
      })
      Elders.getData(localStorage.token, function(data){
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('dashboard');
      }, function(response){
        Elders.logout();
        $scope.noToken=true;
        $ionicLoading.hide();
        var msg="";
        if(response.status==401){
          msg="Nomor handphone tidak terdaftar";
        }else{
          msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        }
      })
    }else{
      $scope.noToken=true;
    }
  })
  $scope.user={
    phone:""
  }
  $scope.login = function(user){
    if(user.$valid){
      $ionicLoading.show({
        template: 'Loading...'
      })
      Elders.login($scope.user.phone, function(data){
        //Users.setData(data.token);
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('dashboard');
      },function(response){
        $ionicLoading.hide();
        var msg="";
        if(response.status==400){
          msg="Nomor handphone tidak terdaftar";
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

.controller('DashCtrl', function($scope, $ionicHistory, Elders, $state) {
  // Form data for the login modal
  $scope.caregivers = Elders.getCaregivers();
  $scope.trackers = Elders.getTrackers();
  $scope.isLocal=function(track){
    if("localId" in track)
      return true;
    else
      return false;
  }
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!Elders.cekLogin()){
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('login')
    }
    else
      $ionicHistory.clearHistory();
  })
  $scope.logout = function(){
    Elders.logout();
    $state.go('login');
  }
  
  $scope.convertCondition=function(cond){
    return Elders.convertCondition(cond);
  }
  
  $scope.datetimeFormat = function(date){
    return moment(date).locale('id').format('DD MMMM YYYY HH:mm');
  };

})

.controller('KondisiCtrl', function($scope, $ionicHistory, Elders, $state) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!Elders.cekLogin()){
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('login')
    }
    else
      $ionicHistory.clearHistory();
  })
  $scope.addTrack=function(cond){
    elder=Elders.getProfile();
    track={
      elder: elder.id,
      type: "dc",
      created: new Date(),
      condition: cond
    }
    Elders.addTrack(track);
    $state.go('dashboard');
  }
})

.controller('AnatomiCtrl', function($scope, Anatomy, $state) {
  $scope.imgs=Anatomy.getData();
  $scope.changeImg=function(image){
    Anatomy.show(image);
  }
})