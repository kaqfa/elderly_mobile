angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$ionicLoading', '$rootScope', '$ionicPopup', '$sce', 'Users', 'Elders', '$timeout', '$state',
	function ($scope, $ionicModal, $ionicLoading, $rootScope, $ionicPopup, $sce, Users, Elders, $timeout, $state) {
        // Form data for the login modal
        $scope.join = {
            phone: ""
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            if (!Users.cekLogin())
                $state.go('login')
        })
        
        $ionicModal.fromTemplateUrl('templates/alert.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalAlert = modal;
        });
        $scope.closeAlert = function () {
            $scope.modalAlert.hide();
        };
        $scope.joinAlert = function () {
            $scope.modalAlert.show();
        };
        $rootScope.oneSignalCallback = function(jsonData) {
            if (jsonData.additionalData && jsonData.additionalData.track && jsonData.additionalData.track.condition=='tb') {
                var elder=Elders.get(jsonData.additionalData.track.elder);
                $scope.alert=elder;
                $scope.modalAlert.show();
            }else{
                alert(jsonData.message);
            }
        };
        
        $ionicModal.fromTemplateUrl('templates/join-parent.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalJoin = modal;
        });
        $scope.closeJoin = function () {
            $scope.modalJoin.hide();
        };

        // Open the login modal
        $scope.joinParent = function () {
            $scope.modalJoin.show();
        };

        $scope.regJoin = function (user) {
            if (user.$valid) {
                console.log("user valid");
                $ionicLoading.show({
                    template: 'Loading...'
                });
                Elders.join($scope.join, Users.getToken(), function (data) {
                    $ionicLoading.hide();
                    $scope.modalJoin.hide();
                }, function (response) {
                    console.log(response);
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
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });
                });
            }
        }
        $scope.elders = Elders.all();
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
            return moment(date).locale('id').format('dddd, DD MMMM YYYY, HH.mm');
        };

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
                $ionicLoading.show({
                    template: 'Loading...'
                })
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
            repass: "",
            phone: "",
            gender: "l"
        };

        $scope.passMatch = true;
        $scope.isMatch = function () {
            if ($scope.user.password == $scope.user.repass) {
                $scope.passMatch = true;
            } else {
                $scope.passMatch = false;
            }
        };

        $scope.register = function (user) {
            fail = function (msg) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: msg
                });
            };

            if (user.$valid && $scope.passMatch) {
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
                        msg = "Username sudah terpakai";
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
                        console.log(response);
                        msg = "Nomor handphone sudah terdaftar";
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
                disableWeekdays: [0],
                closeOnSelect: false,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
        };
	}])

.controller('ParentCtrl', ['$scope', '$ionicLoading', '$state', '$stateParams', '$ionicPopup', 'ionicDatePicker', 'Elders', 'Users',
	function ($scope, $ionicLoading, $state, $stateParams, $ionicPopup, ionicDatePicker, Elders, Users) {
        $scope.$on('$ionicView.beforeEnter', function () {
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
                $scope.tracker = {};
            }
            $scope.getPict = function(){
//                window.imagePicker.getPictures(
//                    function(results) {
//                        for (var i = 0; i < results.length; i++) {
//                            $ionicPopup.alert({
//                                title: 'Image URI',
//                                template: results[i]
//                            });
//                        }
//                    }, function (error) {
//                        $ionicPopup.alert({
//                            title: 'Error',
//                            template: "error"
//                        });
//                    }, {
//                        maximumImagesCount: 1
//                    }
//                );
                navigator.camera.getPicture(
                    function(URI) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        })
                        Elders.uploadPhoto($scope.elder, Users.getToken(), URI, function(data){
                            $scope.elder.photo=data.photo;
                            $scope.$apply();
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
            $scope.sehat = 0;
            $scope.sakit = 0;
            $scope.kangen = 0;
            for (i = 0; i < $scope.tracker.length; i++) {
                if ($scope.tracker[i].condition == 'ba')
                    $scope.sehat += 1;
                else if ($scope.tracker[i].condition == 'bi')
                    $scope.kangen += 1;
                else
                    $scope.sakit += 1;
            }
            $scope.labels = ["Sehat", "Sakit", "Kangen"];
            $scope.data = [$scope.sehat, $scope.sakit, $scope.kangen];
            $scope.colors = ['#33cd5f', '#803690', '#ffc900', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
            $scope.showLocation = function () {
                console.log(ionic.Platform.isAndroid());
                if (ionic.Platform.isAndroid()) {
                    var url = 'geo:'+locationString+'?q='+locationString;
                    window.open(url, '_system', 'location=yes')
                }
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

            $scope.update = function (user) {
                if (user.$valid) {
                    console.log("user valid");
                    $ionicLoading.show({
                        template: 'Loading...'
                    })

                    Elders.update($scope.user, Users.getToken(), function (data) {
                        $ionicLoading.hide();
                        $scope.elder=data;
                        $scope.$apply();
                        console.log($scope.elder)
                    }, function (response) {
                        $ionicLoading.hide();
                        var msg = "";
                        if (response.status == 400) {
                            console.log(response);
                            if (typeof response.data.phone === "undefined")
                                msg = "Edit data orang tua gagal";
                            else
                                msg = "Nomor Telepon sudah terdaftar";
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
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.$parent.refreshData = function () {
                $ionicLoading.show({
                    template: 'Loading...'
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
        });

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
                disableWeekdays: [0],
                closeOnSelect: false,
                templateType: 'popup'
            };
            ionicDatePicker.openDatePicker(ipObj1);
            console.log();
        };

        $scope.convertCondition = function (cond) {
            return Elders.convertCondition(cond);
        }
}])

.controller('HospitalCtrl', ['$scope', function ($scope) {
        $scope.$on('$ionicView.beforeEnter', function () {
            
        });
	}])

.controller('dashCtrl', ['$scope', '$ionicLoading', '$ionicHistory', 'Elders', '$ionicNavBarDelegate',
    function ($scope, $ionicLoading, $ionicHistory, Elders, $ionicNavBarDelegate) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        });
    }])

.controller('ArticlesCtrl', ['$scope', 'Articles', 'Users', '$ionicPopup', '$state',
	function ($scope, Articles, Users, $ionicPopup, $state) {
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

.controller('ArticleCtrl', ['$scope', 'Articles', '$stateParams',
	function ($scope, Articles, $stateParams) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.article = Articles.get($stateParams.articleId);
        });
	}]);
