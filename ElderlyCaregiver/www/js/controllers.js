angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', 'Users', 'Elders', '$timeout', '$state', 
	function($scope, $ionicModal, $ionicLoading, $ionicPopup, Users, Elders, $timeout, $state){
	// Form data for the login modal
	$scope.join = {phone:""};
	$scope.$on('$ionicView.beforeEnter', function(){
		if(!Users.cekLogin())
			$state.go('login')
	})
    $ionicModal.fromTemplateUrl('templates/join-parent.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalJoin = modal;
    });
    $scope.closeJoin = function() {
        $scope.modalJoin.hide();
    };

    // Open the login modal
    $scope.joinParent = function() {
        $scope.modalJoin.show();
    };
        
    $scope.regJoin=function(user){
        if(user.$valid){
            console.log("user valid");
            $ionicLoading.show({
                template: 'Loading...'
            });
            Elders.join($scope.join, Users.getToken(), function(data){
                $ionicLoading.hide();
                $scope.modalJoin.hide();
            },function(response){
                console.log(response);
                $ionicLoading.hide();
                var msg="";
                if(response.status==400){
                    if(typeof response.data.phone != "undefined")
                        msg="Nomor handphone tidak terdaftar";
                    else if(typeof response.data.duplicate != "undefined")
                        msg="Orang tua sudah terdaftar";
                    else
                        msg="Gagal menambahkan orang tua";
                }else{
                    msg="Koneksi gagal";
                }
                $ionicPopup.alert({
                    title: 'Error',
                    template: msg
                });
            });
        }
    }
	$scope.elders = Elders.all();
	$scope.dateFormat = function(date){
		return moment(date, 'DD/MM/YYYY').locale('id').format('DD MMMM YYYY');
	};
	$scope.datetimeFormat = function(date){
		return moment(date, 'DD/MM/YYYY').locale('id').format('DD MMMM YYYY HH:mm');
	};
	$scope.logout = function(){
		Users.logout();
		$state.go('login');
	}

	$scope.refreshData=function(){
		$ionicLoading.show({
			template: 'Tunggu dulu...'
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

}])

.controller('LoginCtrl', [ '$scope', 'Users', 'Elders', '$state', '$ionicPopup', '$ionicHistory', '$ionicLoading', 
	function($scope, Users, Elders, $state, $ionicPopup, $ionicHistory, $ionicLoading) {
		$scope.$on('$ionicView.beforeEnter', function(){

			if(Users.cekLogin()){
                $ionicHistory.nextViewOptions({disableBack: true});
				$state.go('app.dashboard');
            }else if(localStorage.getItem("token") !== null){
				$scope.noToken=false;
				$ionicLoading.show({ template: 'Loading...' })
				Users.getData(localStorage.token, function(data){
					Elders.setAll(localStorage.token, function(data){
						$ionicLoading.hide();
                        $ionicHistory.nextViewOptions({disableBack: true});
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
              $ionicHistory.nextViewOptions({disableBack: true});
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
			}
		};
	}])

.controller('RegCtrl', ['$scope', '$state', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'Users', 'Elders', 
	function($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, Users, Elders) {
		$scope.$on('$ionicView.beforeEnter', function(){
			if(Users.cekLogin())
				$state.go('app.dashboard')
		});

		$scope.user = {fullname:"", email:"", username:"", password:"",
		repass:"", phone:"", gender:"l" }; 

		$scope.passMatch = true;
		$scope.isMatch = function(){
			if($scope.user.password==$scope.user.repass){
				$scope.passMatch = true;
			}else{
				$scope.passMatch = false;
			}
		};

		$scope.register = function(user){
			fail=function(msg){
				$ionicPopup.alert({
					title: 'Error',
					template: msg
				});
			};

			if(user.$valid && $scope.passMatch){
				$ionicLoading.show({
					template: 'Loading...'
				});

				Users.register($scope.user, function(data){
					Users.login($scope.user.username, $scope.user.password, function(data){
						Elders.setAll(data.token, function(data){
							$ionicLoading.hide();
                            $ionicHistory.nextViewOptions({disableBack: true});
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
	}])

.controller('regParentCtrl', 
	['$scope', '$state', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'ionicDatePicker', 'Users', 'Elders',
	function($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, ionicDatePicker, Users, Elders) {
		$scope.$on('$ionicView.beforeEnter', function(){
			if(!Users.cekLogin())
				$state.go('login')
		})

		$scope.user = { fullname:"", birthday:"", phone:"", gender:"l" };	

		$scope.register = function(user){
			if(user.$valid){
				console.log("user valid");
				$ionicLoading.show({
					template: 'Loading...'
				});

				Elders.add($scope.user, Users.getToken(), function(data){
					$ionicLoading.hide();
                    $ionicHistory.nextViewOptions({disableBack: true});
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
				callback: function (val) { 
					tgl = new Date(val);
					text = moment(tgl).format("DD/MM/YYYY");
					// console.log('Return value from the datepicker popup is : ' + val);
					$scope.user.birthday = text;
				},
				from: new Date(1930, 1, 1), 
				to: new Date(1990, 1, 1), 
				inputDate: $scope.subsYear(new Date(), 40),
				mondayFirst: true,
				dateFormat: 'dd/MM/yyyy',
				disableWeekdays: [0],
				closeOnSelect: false,
				templateType: 'popup'
			};
			ionicDatePicker.openDatePicker(ipObj1);
		};
	}])

.controller('ParentCtrl', 
	['$scope', '$ionicLoading', '$state', '$stateParams', '$ionicPopup', 'ionicDatePicker', 'Elders', 'Users', 
	function($scope, $ionicLoading, $state, $stateParams, $ionicPopup, ionicDatePicker, Elders, Users) {
		$scope.$on('$ionicView.beforeEnter', function(){
			elder = Elders.get($stateParams.parentId);    
			if(elder!=null){
				$scope.elder = elder.elder;
				$scope.tracker = elder.tracker;
				$scope.user = { id: $scope.elder.id,
					fullname: $scope.elder.user.first_name+" "+$scope.elder.user.last_name,
					birthday: $scope.elder.birthday,
					phone: $scope.elder.phone,
					gender: $scope.elder.gender
				};      
			} else {
				$scope.elder = {};
				$scope.tracker = {};
			}    
			$scope.sehat = 0;
			$scope.sakit = 0;
			$scope.kangen = 0;
			for (i = 0; i < $scope.tracker.length; i++) {
				if($scope.tracker[i].condition == 'ba')
					$scope.sehat += 1;
				else if($scope.tracker[i].condition == 'bi')
					$scope.kangen += 1;
				else
					$scope.sakit += 1;
			}
			$scope.labels = ["Sehat", "Sakit", "Kangen"];
			$scope.data = [$scope.sehat, $scope.sakit, $scope.kangen];
			$scope.colors = ['#33cd5f', '#803690', '#ffc900', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

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
			};

			$scope.update = function(user){
				if(user.$valid){
					console.log("user valid");
					$ionicLoading.show({
						template: 'Loading...'
					})

					Elders.update($scope.user, Users.getToken(), function(data){
						$ionicLoading.hide();
						$state.go('app.parent');
					},function(response){
						$ionicLoading.hide();
						var msg = "";
						if(response.status==400){
							console.log(response);
                            if(typeof response.data.phone === "undefined")
                                msg = "Edit data orang tua gagal";
                            else
                                msg = "Nomor Telepon sudah terdaftar";
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
				  	text = moment(tgl).format("DD/MM/YYYY");
					// console.log('Return value from the datepicker popup is : ' + val);
					$scope.user.birthday = text;
				},
				from: new Date(1930, 1, 1), //Optional
				to: new Date(1990, 1, 1), //Optional
				mondayFirst: true,
				inputDate: moment($scope.user.birthday, 'DD/MM/YYYY').toDate(),
				dateFormat: 'dd/MM/yyyy',
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
}])

.controller('dashCtrl', 
	['$scope', '$ionicLoading', '$ionicHistory', 'Elders', '$ionicNavBarDelegate',
	function($scope, $ionicLoading, $ionicHistory, Elders, $ionicNavBarDelegate) {
		$scope.$on('$ionicView.beforeEnter', function(){
            $ionicHistory.nextViewOptions({disableBack: true});
		});
	}]);
