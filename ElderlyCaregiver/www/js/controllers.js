angular.module('starter.controllers', [])

.controller('AppCtrl', 
    ['$scope', '$ionicModal', '$ionicLoading', '$rootScope', '$ionicPopup', '$sce', 'Users', 'Elders', '$timeout', '$state', '$ionicSideMenuDelegate', '$ionicHistory',
	function ($scope, $ionicModal, $ionicLoading, $rootScope, $ionicPopup, $sce, Users, Elders, $timeout, $state, $ionicSideMenuDelegate, $ionicHistory) {        
        $scope.join = { phone: "" };
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.curuser = Users.getUser();
            if (!Users.cekLogin())
                $state.go('login')
        })
        $scope.closeMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
        }
        $scope.call = function(number){
            window.plugins.CallNumber.callNumber(function (result) {
                console.log("Success:" + result);
            }, function (result) {
                console.log("Error:" + result);
            }, number, false);
        }
        $ionicModal.fromTemplateUrl('templates/alert.html', {scope: $scope})
                   .then(function (modal) { $scope.modalAlert = modal; });

        $scope.closeAlert = function () { $scope.modalAlert.hide(); };

        if (ionic.Platform.isWebView()) {
            $rootScope.oneSignalCallback = function(jsonData) {
                if (jsonData.additionalData && jsonData.additionalData.track) {
                    Elders.addTrackElder(jsonData.additionalData.track)
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                    if(jsonData.additionalData.track.condition == 'tb'){
                        var elder = Elders.get(jsonData.additionalData.track.elder);
                        $scope.alert = elder;
                        $scope.modalAlert.show();
                    }else{
                        $state.go('app.parentCondition', {parentId: jsonData.additionalData.track.elder}, {
                            reload: true
                        });
                    }
                }else{
                    alert(jsonData.message);
                }
            };
        }

        $ionicModal.fromTemplateUrl('templates/join-parent.html', { scope: $scope })
                   .then(function (modal) { $scope.modalJoin = modal; });
        
        $scope.closeJoin = function () { $scope.modalJoin.hide(); };
        
        $scope.joinParent = function () { $scope.modalJoin.show(); };

        $scope.demoModal = function () { $scope.modalAlert.show(); };

        $scope.call = function(number){
            window.plugins.CallNumber.callNumber(function (result) {
                console.log("Success:" + result);
            }, function (result) {
                console.log("Error:" + result);
            }, number, false);
        }

        $scope.regJoin = function (user) {
            if (user.$valid) {
                console.log("user valid");
                $ionicLoading.show({ template: 'Loading...' });
                Elders.join($scope.join, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $scope.modalJoin.hide();
                }, function (response) {
                    // console.log(response);
                    $ionicLoading.hide();
                    var msg = "";
                    
                    if (response.status == 400) {
                        if (typeof response.data.phone != "undefined")
                            msg = "Nomor handphone tidak terdaftar";
                        else if (typeof response.data.duplicate != "undefined")
                            msg = "Orang tua sudah terdaftar";
                        else
                            msg = "Gagal menambahkan orang tua";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    
                    $ionicPopup.alert({ title: 'Error', template: msg });
                });
            }
        };
        
        $scope.dateFormat = function (date) {
            return moment(date, 'DD/MM/YYYY').locale('id').format('DD MMMM YYYY');
        };
        
        $scope.datetimeFormat = function (date) {
            return moment(date).locale('id').format('DD MMMM YYYY HH:mm');
        };
        
        $scope.logout = function () {
            Users.logout();
            $state.go('login');
        }

        $scope.refreshData = function () {
            $ionicLoading.show({
                template: 'Tunggu dulu...'
            })

            Users.getData(localStorage.token, function (data) {
                Elders.setAll(localStorage.token, function (data) {
                    $ionicLoading.hide();
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "Koneksi gagal";
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }, function (response) {
                Users.logout();
                $scope.noToken = true;
                $ionicLoading.hide();
                var msg = "";
                if (response.status == 401) {
                    msg = "Username atau password salah";
                } else {
                    msg = "Koneksi gagal";
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                }
            })
        }

        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
        }
        $scope.dateArticle = function (date) {
            return moment(date).locale('id').format('dddd, DD MMMM YYYY');
        };

        $scope.elders = Elders.all();
}])

.controller('LoginCtrl', ['$scope', 'Users', 'Elders', '$state', '$ionicPopup', '$ionicHistory', '$ionicLoading',
	function ($scope, Users, Elders, $state, $ionicPopup, $ionicHistory, $ionicLoading) {
        $scope.$on('$ionicView.beforeEnter', function () {

            if (Users.cekLogin()) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.dashboard');
            } else if (localStorage.getItem("token") !== null) {
                $scope.noToken = false;
                $ionicLoading.show({ template: 'Loading...' });

                Users.getData(localStorage.token, function (data) {
                    Elders.setAll(localStorage.token, function (data) {
                        $ionicLoading.hide();
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.dashboard');
                    }, function (response) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    });
                }, function (response) {
                    Users.logout();
                    $scope.noToken = true;
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 401) {
                        msg = "Username atau password salah";
                    } else {
                        msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    }
                })
            } else {
                $scope.noToken = true;
                window.plugins.OneSignal.getTags(function(tags) {
                    var unsub=[];
                    for(keys in tags)
                        unsub.push(keys);
                    window.plugins.OneSignal.deleteTags(unsub);
                });
            }
        })
        $scope.user = {
            username: "",
            password: ""
        }
        $scope.login = function (user) {
            if (user.$valid) {
                $ionicLoading.show({
                    template: 'Loading...'
                })
                Users.login($scope.user.username, $scope.user.password, function (data) {
                    //Users.setData(data.token);
                    Elders.setAll(data.token, function (data) {
                        $ionicLoading.hide();
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.dashboard');
                    }, function (response) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    });
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        msg = "Username atau password salah";
                    } else {
                        msg = "Koneksi gagal";
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
	function ($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, Users, Elders) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (Users.cekLogin())
                $state.go('app.dashboard')
        });

        $scope.user = {
            fullname: "",
            email: "",
            username: "",
            password: "",
            phone: "",
            gender: "l"
        };
        
        $scope.showPassword=true;

        //$scope.passMatch = true;
        /*
        $scope.isMatch = function () {
            if ($scope.user.password == $scope.user.repass) {
                $scope.passMatch = true;
            } else {
                $scope.passMatch = false;
            }
        };
        */

        $scope.register = function (user) {
            fail = function (msg) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: msg
                });
            };

            if (user.$valid) {
                $ionicLoading.show({
                    template: 'Loading...'
                });

                Users.register($scope.user, function (data) {
                    Users.login($scope.user.username, $scope.user.password, function (data) {
                        Elders.setAll(data.token, function (data) {
                            $ionicLoading.hide();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.dashboard');
                        }, function (response) {
                            $ionicLoading.hide();
                            var msg = "Koneksi gagal";
                            fail(msg);
                        });
                    }, function (response) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        fail(msg);
                    })
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        if(typeof response.data.username != 'undefined')
                            msg = "Username sudah terpakai";
                        else if(typeof response.data.phone != 'undefined')
                            msg = "Nomor handphone sudah terpakai/Format nomor handphone salah";
                        else
                            msg = "Koneksi gagal";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    fail(msg);
                });
            }
        };
	}])

.controller('ResetCtrl', ['$scope', '$state', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'Users', 'Elders',
    function ($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, Users, Elders) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (Users.cekLogin())
                $state.go('app.dashboard')
        });

        $scope.user = {
            email: ""
        };
        

        //$scope.passMatch = true;
        /*
        $scope.isMatch = function () {
            if ($scope.user.password == $scope.user.repass) {
                $scope.passMatch = true;
            } else {
                $scope.passMatch = false;
            }
        };
        */

        $scope.reset = function (user) {
            fail = function (msg) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: msg
                });
            };

            if (user.$valid) {
                $ionicLoading.show({
                    template: 'Loading...'
                });

                Users.reset($scope.user.email, function (data) {
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicPopup.alert({
                        template: 'Silahkan cek email anda untuk mendapatkan password baru.'
                    });
                    $state.go('app.login');
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        if(typeof response.data.notfound != 'undefined')
                            msg = "Email tidak terdaftar";
                        else
                            msg = "Koneksi gagal";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    fail(msg);
                });
            }
        };
    }])

.controller('regParentCtrl', ['$scope', '$state', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'ionicDatePicker', 'Users', 'Elders',
	function ($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, ionicDatePicker, Users, Elders) {
        $scope.$on('$ionicView.beforeEnter', function () {
            if (!Users.cekLogin())
                $state.go('login')
        })

        $scope.user = {
            fullname: "",
            birthday: "",
            phone: "",
            gender: "l"
        };

        $scope.register = function (user) {
            if (user.$valid) {
                console.log("user valid");
                $ionicLoading.show({
                    template: 'Loading...'
                });

                Elders.add($scope.user, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.dashboard');
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        msg = "Nomor handphone sudah terpakai/Format nomor handphone salah";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }
        };

        $scope.subsYear = function (date, years) {
            date.setYear(date.getYear() - years);
            return date;
        };

        $scope.datePick = function () {
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
                // disableWeekdays: [0],
                closeOnSelect: false,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
        };
	}])

.controller('ParentCtrl', ['$scope', 'Elders', '$stateParams', function ($scope, Elders, $stateParams) {
    $scope.$on('$ionicView.beforeEnter', function () {
        elder = Elders.get($stateParams.parentId);
        $scope.elder = elder.elder;
    })
}])

.controller('ParentConditionCtrl', 
    ['$scope', '$state', '$stateParams', 'Elders', '$ionicLoading', '$ionicPopup', 'Users', 
    function ($scope, $state, $stateParams, Elders, $ionicLoading, $ionicPopup, Users) {
        $scope.$on('$ionicView.beforeEnter', function () {
            elder = Elders.get($stateParams.parentId);
            if (elder != null) {
                $scope.photo = elder.elder.photo;
                $scope.elder = elder.elder;
                tracker = elder.tracker;
                console.log(tracker)
                $scope.tracker = tracker.slice(0, 50);
                $scope.user = {
                    id: $scope.elder.id,
                    fullname: $scope.elder.user.first_name + " " + $scope.elder.user.last_name,
                    birthday: $scope.elder.birthday,
                    phone: $scope.elder.phone,
                    gender: $scope.elder.gender
                };
            } else {
                $scope.elder = {};
                $scope.tracker = {};
            }
            
            $scope.$parent.refreshData = function () {
                    $ionicLoading.show({
                        template: 'Loading...'
                    })
                    Elders.refreshTrackElder($scope.elder.id, localStorage.token, function (data) {
                        $ionicLoading.hide();
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    }, function (callback) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    });
                }; 
        });        

        $scope.showLocation = function () {
            console.log(ionic.Platform.isAndroid());
            if (ionic.Platform.isAndroid()) {
                var url = 'geo:'+locationString+'?q='+locationString;
                window.open(url, '_system', 'location=yes')
            }
        };

        $scope.convertCondition = function (cond) {
            return Elders.convertCondition(cond);
        };
    }])

.controller('ParentGraphicCtrl', 
    ['$scope', '$state', '$stateParams', 'Elders', '$ionicLoading', '$ionicPopup', 'ionicDatePicker', 'Users', 
    function ($scope, $state, $stateParams, Elders, $ionicLoading, $ionicPopup, ionicDatePicker, Users) {
        $scope.$on('$ionicView.beforeEnter', function () {
            var fromDate;
            var toDate;
            if(localStorage.getItem("graphFrom") !== null&&localStorage.getItem("graphTo") !== null){
                $scope.fromDate=localStorage.getItem("graphFrom");
                $scope.toDate=localStorage.getItem("graphTo");
                fromDate=moment($scope.fromDate, "DD/MM/YYYY");
                toDate=moment($scope.toDate, "DD/MM/YYYY");
                localStorage.removeItem("graphFrom");
                localStorage.removeItem("graphTo");
            }else{
                fromDate=moment().subtract(30, 'days');
                toDate=moment();
                $scope.fromDate=fromDate.format("DD/MM/YYYY");
                $scope.toDate=toDate.format("DD/MM/YYYY");
            }
            elder = Elders.get($stateParams.parentId);
            if (elder != null) {
                $scope.photo = elder.elder.photo;
                $scope.elder = elder.elder;
                $scope.tracker = elder.tracker;
                $scope.user = {
                    id: $scope.elder.id,
                    fullname: $scope.elder.user.first_name + " " + $scope.elder.user.last_name,
                    birthday: $scope.elder.birthday,
                    phone: $scope.elder.phone,
                    gender: $scope.elder.gender
                };
            } else {
                $scope.elder = {};
                $scope.tracker = [];
            }
            $scope.sehat = 0;
            $scope.sakit = 0;
            $scope.kangen = 0;
            $scope.latest = null;
            for (i = 0; i < $scope.tracker.length; i++) {
                current = moment($scope.tracker[i].modified);
                if(current.diff(fromDate,"days") >= 0 && current.diff(toDate,"days") <= 0){
                    if ($scope.tracker[i].condition == 'ba')
                        $scope.sehat += 1;
                    else if ($scope.tracker[i].condition == 'bi')
                        $scope.kangen += 1;
                    else
                        $scope.sakit += 1;                    
                }
            }

            latest = moment($scope.tracker[0].modified);
            if (latest.diff(toDate,"days") == 0)
                $scope.latest = $scope.tracker[0];

            $scope.labels = ["Sehat",  "Kangen", "Sakit"];
            $scope.data = [$scope.sehat, $scope.kangen, $scope.sakit];
            $scope.colors = ['#33cd5f', '#ffc900', '#ef473a'];
            $scope.options = {responsive: true, maintainAspectRatio: false};
            $scope.$parent.refreshData = function () {
                    $ionicLoading.show({
                        template: 'Loading...'
                    })
                    Elders.refreshTrackElder($scope.elder.id, localStorage.token, function (data) {
                        $ionicLoading.hide();
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    }, function (callback) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    });
                }; 
        }); 
        $scope.convertCondition = function (cond) {
            return Elders.convertCondition(cond);
        };
        $scope.datePick = function (dt, type) {
            var ipObj1 = {
                callback: function (val) {
                    tgl = new Date(val);
                    text = moment(tgl).format("DD/MM/YYYY");
                    // console.log('Return value from the datepicker popup is : ' + val);
                    if(type==0) //from
                        $scope.fromDate = text;
                    else //to
                        $scope.toDate = text;
                    localStorage.graphFrom = $scope.fromDate;
                    localStorage.graphTo = $scope.toDate;
                    $state.go($state.current, {}, {
                        reload: true
                    });
                },
                
                
                inputDate: moment(dt, 'DD/MM/YYYY').toDate(),
                mondayFirst: true,
                dateFormat: 'dd/MM/yyyy',
                // disableWeekdays: [0],
                closeOnSelect: false,
                templateType: 'popup'
            };
            if(type==1)
                ipObj1.from=moment($scope.fromDate, 'DD/MM/YYYY').toDate();
            else
                ipObj1.to= moment($scope.toDate, 'DD/MM/YYYY').toDate();
            ionicDatePicker.openDatePicker(ipObj1);
        };
    }])

.controller('ParentProfileCtrl', 
    ['$scope', '$state', '$stateParams', 'Elders', '$ionicLoading', '$ionicPopup', 'Users', 'ionicDatePicker',
    function ($scope, $state, $stateParams, Elders, $ionicLoading, $ionicPopup, Users, ionicDatePicker) {
        $scope.$on('$ionicView.beforeEnter', function () {
            elder = Elders.get($stateParams.parentId);
            console.log(elder);
            if (elder != null) {
                $scope.photo = elder.elder.photo;
                $scope.elder = elder.elder;                
                $scope.user = {
                    id: $scope.elder.id,
                    fullname: $scope.elder.user.first_name + " " + $scope.elder.user.last_name,
                    birthday: $scope.elder.birthday,
                    phone: $scope.elder.phone,
                    gender: $scope.elder.gender
                };
            } else {
                $scope.elder = {};                
            }
            
            $scope.$parent.refreshData = function () {
                $ionicLoading.show({ template: 'Loading...' });
                Elders.refreshTrackElder($scope.elder.id, localStorage.token, function (data) {
                    $ionicLoading.hide();
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }, function (callback) {
                    $ionicLoading.hide();
                    var msg = "Koneksi gagal";
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }; 
        }); 
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.$parent.refreshData = function () {
                $ionicLoading.show({ template: 'Loading...' });
                Users.getData(localStorage.token, function (data) {
                    Elders.setAll(localStorage.token, function (data) {
                        $ionicLoading.hide();
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    }, function (response) {
                        $ionicLoading.hide();
                        var msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    });
                }, function (response) {
                    Users.logout();
                    $scope.noToken = true;
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 401) {
                        msg = "Username atau password salah";
                    } else {
                        msg = "Koneksi gagal";
                        $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                    }
                })
            }
        });

        $scope.getPict = function(){
            navigator.camera.getPicture(
                function(URI) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    })
                    Elders.uploadPhoto($scope.elder, Users.getToken(), URI, function(data){
                        $scope.elder.photo=data.photo;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                        $ionicLoading.hide();
                    }, function(r){
                        $ionicLoading.hide();
                        if(r.http_status==400)
                            var error="Ada kerusakan/kesalahan pada file gambar"
                        else
                            var error="Koneksi error"
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    })
                }, function (error) {
                    
                }, {
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.NATIVE_URI
                }
            );
        }

        $scope.update = function (user) {
            if (user.$valid) {
                console.log("user valid");
                $ionicLoading.show({
                    template: 'Loading...'
                })

                Elders.update($scope.user, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $scope.elder=data;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                    console.log($scope.elder)
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        console.log(response);
                        if (typeof response.data.phone === "undefined")
                            msg = "Edit data orang tua gagal";
                        else
                            msg = "Nomor handphone sudah terdaftar/Format nomor handphone salah";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }
        };
        
        $scope.datePick = function () {
            var ipObj1 = {
                callback: function (val) { //Mandatory
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
                // disableWeekdays: [0],
                closeOnSelect: false,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
            console.log();
        };
    }])

.controller('HospitalCtrl', ['$scope', function ($scope) {
        $scope.$on('$ionicView.beforeEnter', function () {
            
        });
	}])

.controller('dashCtrl', ['$scope', '$ionicLoading', '$ionicHistory', 'Elders',
    function ($scope, $ionicLoading, $ionicHistory, Elders) {
        $scope.$on('$ionicView.beforeEnter', function () {
            //$ionicHistory.nextViewOptions({ disableBack: true });
        });
    }])

.controller('ArticlesCtrl', ['$scope', '$ionicLoading', 'Articles', 'Users', '$ionicPopup', '$state',
	function ($scope, $ionicLoading, Articles, Users, $ionicPopup, $state) {
        $scope.title = "Artikel Terbaru";
        $scope.isNextAvailable = false;
        $scope.articleList = Articles.getAll();

        $scope.doRefresh = function () {
            Articles.refresh(Users.getToken(), function (data) {
                if (data.next != null)
                    $scope.isNextAvailable = true;
                else
                    $scope.isNextAvailable = false;
                console.log($scope.ArticleList);
                $scope.$broadcast('scroll.refreshComplete');
            }, function (response) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Koneksi gagal'
                });
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.loadMore = function () {
            Articles.getLatest(Users.getToken(), function (data) {
                if (data.next != null)
                    $scope.isNextAvailable = true;
                else
                    $scope.isNextAvailable = false;
                console.log($scope.ArticleList);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (response) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Koneksi gagal'
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        $scope.$on('$ionicView.beforeEnter', function () {                        
            Articles.loadFirst(Users.getToken(), function (data) {                
                if (data.next != null)
                    $scope.isNextAvailable = true;
                else
                    $scope.isNextAvailable = false;
                console.log($scope.ArticleList);
                $scope.$broadcast('scroll.infiniteScrollComplete');                   
            }, function (response) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Koneksi gagal'
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });            
        });
	}])
.controller('ProfileCtrl', ['$scope', 'Users', '$ionicPopup', '$ionicLoading',
	function ($scope, Users, $ionicPopup, $ionicLoading) {
        $scope.$on('$ionicView.beforeEnter', function () {
            user = Users.getUser();
            $scope.cg = user;
            $scope.user = {
                fullname: user.user.first_name+" "+user.user.last_name,
                email: user.user.email,
                phone: user.phone,
                gender: user.gender
            };
        });
        $scope.update = function (user) {
            if (user.$valid) {
                console.log("user valid");
                $ionicLoading.show({
                    template: 'Loading...'
                })

                Users.update($scope.user, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $scope.curuser.user.first_name=data.user.first_name;
                    $scope.curuser.user.last_name=data.user.last_name;
                    $scope.curuser.user.email=data.user.email;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        console.log(response);
                        if (typeof response.data.phone === "undefined")
                            msg = "Edit profil gagal";
                        else
                            msg = "Nomor handphone sudah terdaftar/Format nomor handphone salah";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }
        };
        $scope.getPict = function(){
            navigator.camera.getPicture(
                function(URI) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    })
                    Users.uploadPhoto(Users.getToken(), URI, function(data){
                        $scope.cg.photo=data.photo;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                        $ionicLoading.hide();
                    }, function(r){
                        $ionicLoading.hide();
                        if(r.http_status==400)
                            var error="Ada kerusakan/kesalahan pada file gambar"
                        else
                            var error="Koneksi error"
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    })
                }, function (error) {
                    
                }, {
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.NATIVE_URI
                }
            );
        }
	}])

.controller('PasswordCtrl', ['$scope', 'Users', '$ionicPopup', '$ionicLoading',
	function ($scope, Users, $ionicPopup, $ionicLoading) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.user = {
                password: "",
                repass: ""
            };
        });
        $scope.passMatch = true;
        $scope.isMatch = function () {
            if ($scope.user.password == $scope.user.repass) {
                $scope.passMatch = true;
            } else {
                $scope.passMatch = false;
            }
        };
        $scope.update = function (user) {
            if (user.$valid && $scope.passMatch) {
                console.log("user valid");
                $ionicLoading.show({
                    template: 'Loading...'
                })

                Users.update($scope.user, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $scope.curuser.user.first_name=data.user.first_name;
                    $scope.curuser.user.last_name=data.user.last_name;
                    console.log(data);
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }, function (response) {
                    $ionicLoading.hide();
                    var msg = "";
                    if (response.status == 400) {
                        console.log(response);
                        if (typeof response.data.phone === "undefined")
                            msg = "Edit profil gagal";
                        else
                            msg = "Nomor handphone sudah terdaftar/Format nomor handphone salah";
                    } else {
                        msg = "Koneksi gagal";
                    }
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }
        };
	}])
.controller('ArticleCtrl', ['$scope', 'Articles', '$stateParams',
	function ($scope, Articles, $stateParams) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.article = Articles.get($stateParams.articleId);
        });
	}]);
