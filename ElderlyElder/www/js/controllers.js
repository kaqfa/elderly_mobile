angular.module('starter.controllers', [])

.controller('LoginCtrl', function ($scope, $ionicLoading, $ionicPopup, $ionicHistory, Elders, $state) {
    $scope.$on('$ionicView.beforeEnter', function () {
        if (Elders.cekLogin()) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
            $state.go('dashboard');
        } else if (localStorage.getItem("token") !== null) {
            $scope.noToken = false;
            $ionicLoading.show({
                template: 'Loading...'
            })
            Elders.getData(localStorage.token, function (data) {
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
                Elders.startWatch();
                $state.go('dashboard');
            }, function (response) {
                Elders.logout();
                $scope.noToken = true;
                $ionicLoading.hide();
                var msg = "";
                if (response.status == 401) {
                    msg = "Nomor handphone tidak terdaftar";
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
        }
    })
    $scope.user = {
        phone: ""
    }
    $scope.login = function (user) {
        if (user.$valid) {
            $ionicLoading.show({
                template: 'Loading...'
            })
            Elders.login($scope.user.phone, function (data) {
                //Users.setData(data.token);
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });
                Elders.startWatch();
                $state.go('dashboard');
            }, function (response) {
                $ionicLoading.hide();
                var msg = "";
                if (response.status == 400) {
                    msg = "Nomor handphone tidak terdaftar";
                } else {
                    msg = "Koneksi gagal";
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

.controller('DashCtrl', function ($scope, $ionicHistory, Elders, $state) {
    // Form data for the login modal
    $scope.caregivers = Elders.getCaregivers();
    $scope.trackers = Elders.getTrackers();
    $scope.isLocal = function (track) {
        if ("localId" in track)
            return true;
        else
            return false;
    }
    $scope.$on('$ionicView.beforeEnter', function () {
        if (!Elders.cekLogin()) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
            $state.go('login')
        } else
            $ionicHistory.clearHistory();
    })
    $scope.logout = function () {
        Elders.startWatch();
        Elders.logout();
        $state.go('login');
    }

    $scope.convertCondition = function (cond) {
        return Elders.convertCondition(cond);
    }

    $scope.datetimeFormat = function (date) {
        return moment(date).locale('id').format('DD MMMM YYYY HH:mm');
    };

    $scope.panicBtn = function (number) {
        elder = Elders.getProfile();
        console.log("asd");
        track = {
            elder: elder.id,
            type: "dc",
            created: new Date(),
            condition: "tb",
            location: Elders.getLocation()
        }
        Elders.addTrack(track);
        window.plugins.CallNumber.callNumber(function (result) {
            console.log("Success:" + result);
        }, function (result) {
            console.log("Error:" + result);
        }, number, false);
    }

})

.controller('KondisiCtrl', function ($scope, $ionicHistory, Elders, $state) {
    $scope.$on('$ionicView.beforeEnter', function () {
        if (!Elders.cekLogin()) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
            $state.go('login');
        } else
            $ionicHistory.clearHistory();
    })
    $scope.addTrack = function (cond) {
        elder = Elders.getProfile();
        track = {
            elder: elder.id,
            type: "dc",
            created: new Date(),
            condition: cond,
            location: Elders.getLocation()
        }
        Elders.addTrack(track);
        $state.go('dashboard');
    }
})

.controller('AnatomiCtrl', function ($scope, $ionicPopup, $ionicHistory, Anatomy, $state, Elders) {
    $scope.$on('$ionicView.beforeEnter', function () {
        if (!Elders.cekLogin()) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
            $state.go('login')
        } else
            $ionicHistory.clearHistory();
    })
    $scope.imgs = Anatomy.getData();
    $scope.condition = "";
    $scope.changeImg = function (image) {
        Anatomy.show(image);
    }
    $scope.confirm = function (cond) {
        $scope.changeImg('human');
        $scope.condition = Elders.convertCondition(cond);
        var confirmPopup = $ionicPopup.show({
            title: 'Konfirmasi',
            template: 'Apakah anda sedang ' + $scope.condition + '?',
            buttons: [
                {
                    text: 'Tidak',
                    type: 'button-assertive'
      },
                {
                    text: '<b>Ya</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.addTrack(cond);
                    }
      }]
        });
    }
    $scope.addTrack = function (cond) {
        elder = Elders.getProfile();
        track = {
            elder: elder.id,
            type: "dc",
            created: new Date(),
            condition: cond,
            location: Elders.getLocation()
        }
        console.log(track);
        Elders.addTrack(track);
        $state.go('dashboard');
    }
})

.controller('ArticlesCtrl', ['$scope', 'Articles', 'Elders', '$ionicPopup', '$state',
	function ($scope, Articles, Elders, $ionicPopup, $state) {
        $scope.title = "Artikel Terbaru";
        $scope.isNextAvailable = false;
        $scope.articleList = Articles.getAll();

        $scope.doRefresh = function () {
            Articles.refresh(Elders.getToken(), function (data) {
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
            Articles.getLatest(Elders.getToken(), function (data) {
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
            Articles.loadFirst(Elders.getToken(), function (data) {
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
	}])

.controller('GreetCtrl', ['$scope', 'Elders',
	function ($scope, Elders) {
        $scope.caregivers = Elders.getCaregivers();
        $scope.call = function(number){
            window.plugins.CallNumber.callNumber(function (result) {
                console.log("Success:" + result);
            }, function (result) {
                console.log("Error:" + result);
            }, number, false);
        }
	}]);