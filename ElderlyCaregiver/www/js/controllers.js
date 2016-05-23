angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicLoading, Users, Elders, $timeout, $state) {

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
  $scope.elders = Elders.all();
  $scope.dateFormat = function(date){
    return moment(date).locale('id').format('DD MMMM YYYY');
  };
  $scope.datetimeFormat = function(date){
    return moment(date).locale('id').format('DD MMMM YYYY HH:mm');
  };
  $scope.logout = function(){
    Users.logout();
    $state.go('login');
  }
  
  $scope.refreshData=function(){
    $ionicLoading.show({
      template: 'Loading...'
    })
    Users.getData(localStorage.token, function(data){
        Elders.setAll(localStorage.token, function(data){
          $ionicLoading.hide();
          $state.go($state.current, {}, {reload: true});
        }, function(response){
          $ionicLoading.hide();
          var msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        });
      }, function(response){
        Users.logout();
        $scope.noToken=true;
        $ionicLoading.hide();
        var msg="";
        if(response.status==401){
          msg="Username atau password salah";
        }else{
          msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        }
      })
  }

})

.controller('LoginCtrl', function($scope, Users, Elders, $state, $ionicPopup, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(Users.cekLogin())
      $state.go('app.dashboard');
    else if(localStorage.getItem("token")!==null){
      $scope.noToken=false;
      $ionicLoading.show({
        template: 'Loading...'
      })
      Users.getData(localStorage.token, function(data){
        Elders.setAll(localStorage.token, function(data){
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
      }, function(response){
        Users.logout();
        $scope.noToken=true;
        $ionicLoading.hide();
        var msg="";
        if(response.status==401){
          msg="Username atau password salah";
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

.controller('regParentCtrl', function($scope, Users, Elders, $state, $ionicPopup, $ionicLoading, ionicDatePicker) {
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!Users.cekLogin())
      $state.go('login')
  })
  
  $scope.user = {
    fullname:"",
    birthday:"",
    phone:"",
    gender:"l"
  }

  $scope.register = function(user){
    if(user.$valid){
      console.log("user valid");
      $ionicLoading.show({
        template: 'Loading...'
      })
      Elders.add($scope.user, Users.getToken(), function(data){
        $ionicLoading.hide();
        $state.go('app.dashboard');
      },function(response){
        $ionicLoading.hide();
        var msg="";
        if(response.status==400){
          console.log(response);
          msg="Nomor handphone sudah terdaftar";
        }else{
          msg="Koneksi gagal";
        }
        $ionicPopup.alert({
         title: 'Error',
         template: msg
        });
      });
    }
  };

  $scope.subsYear = function(date, years){
      date.setYear(date.getYear() - years);
      return date;
  };

  $scope.datePick = function(){
    var ipObj1 = {
      callback: function (val) {  //Mandatory
        tgl = new Date(val);
        text = tgl.getFullYear()+'-'+(tgl.getMonth()+1)+'-'+tgl.getDate();
        // console.log('Return value from the datepicker popup is : ' + val);
        $scope.user.birthday = text;
      },        
      
      from: new Date(1930, 1, 1), //Optional
      to: new Date(1990, 1, 1), //Optional
      inputDate: $scope.subsYear(new Date(), 40),
      mondayFirst: true,
      disableWeekdays: [0],
      closeOnSelect: false,
      templateType: 'popup'
    };
    ionicDatePicker.openDatePicker(ipObj1);
  };
  
})

.controller('ParentCtrl', function($scope, $ionicLoading, $state, Elders, Users, $stateParams, ionicDatePicker) {
  $scope.$on('$ionicView.beforeEnter', function(){
    elder = Elders.get($stateParams.parentId);
    if(elder!=null){
      $scope.elder = elder.elder;
      $scope.tracker = elder.tracker;
      $scope.user = {
        fullname: $scope.elder.user.first_name+" "+$scope.elder.user.last_name,
        birthday: $scope.elder.birthday,
        phone: $scope.elder.phone,
        gender: $scope.elder.gender
      };
    } else {
      $scope.elder = {};
      $scope.tracker = {};
    }
    $scope.$parent.refreshData = function(){
      $ionicLoading.show({
        template: 'Loading...'
      })
      Elders.refreshTrackElder($scope.elder.id, localStorage.token, function(data){
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: true});
      }, function(callback){
        $ionicLoading.hide();
        var msg="Koneksi gagal";
        $ionicPopup.alert({
         title: 'Error',
         template: msg
        });
      });
    }
  });
  
  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.$parent.refreshData=function(){
      $ionicLoading.show({
        template: 'Loading...'
      })
      Users.getData(localStorage.token, function(data){
        Elders.setAll(localStorage.token, function(data){
          $ionicLoading.hide();
          $state.go($state.current, {}, {reload: true});
        }, function(response){
          $ionicLoading.hide();
          var msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        });
      }, function(response){
        Users.logout();
        $scope.noToken=true;
        $ionicLoading.hide();
        var msg="";
        if(response.status==401){
          msg="Username atau password salah";
        }else{
          msg="Koneksi gagal";
          $ionicPopup.alert({
           title: 'Error',
           template: msg
          });
        }
      })
    }
  });  
  
  $scope.datePick = function(){    
    var ipObj1 = {
      callback: function (val) {  //Mandatory
        tgl = new Date(val);
        text = tgl.getFullYear()+'-'+(tgl.getMonth()+1)+'-'+tgl.getDate();
        // console.log('Return value from the datepicker popup is : ' + val);
        $scope.user.birthday = text;
      },
      
      from: new Date(1930, 1, 1), //Optional
      to: new Date(1990, 1, 1), //Optional        
      mondayFirst: true,
      inputDate: new Date($scope.user.birthday),
      disableWeekdays: [0],
      closeOnSelect: false,
      templateType: 'popup'
    };
    ionicDatePicker.openDatePicker(ipObj1);
    console.log();
  };
  
  $scope.convertCondition=function(cond){
    return Elders.convertCondition(cond);
  }
})

.controller('dashCtrl', function($scope, $ionicHistory, $ionicLoading, Elders) {
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicHistory.clearHistory();
  });
});