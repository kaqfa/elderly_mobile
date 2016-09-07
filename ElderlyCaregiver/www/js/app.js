angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 
	'ionic-datepicker', 'chart.js'])

.run(function($ionicPlatform, $rootScope) {
	$ionicPlatform.ready(function() {
        $rootScope.dailyScheduleFn = function(){
            
        }
        $rootScope.dailySchedule = function () {
            var now=moment().tz('Asia/Jakarta').locale('id');
            if(now.hour()>=8)
                now.add(1, 'days')
            now.hour(8)
            now.minute(0);
            var first=now.toDate()
            cordova.plugins.notification.local.schedule({
                id: 1,
                text: 'Cek kondisi orang tua hari ini',
                every: 'daily',
                firstAt: first,
                icon: "res://icon",
                smallIcon: "res://icon"
            }, function(){
                $rootScope.dailyScheduleFn()
            })
        };
        $rootScope.dailySchedule();
        if (ionic.Platform.isWebView()) {
            $rootScope.oneSignalCallback = function(jsonData) {
                alert(jsonData.message)
            };
            var notificationOpenedCallback = function(jsonData) {
                $rootScope.oneSignalCallback(jsonData);
            };    
            window.plugins.OneSignal.init("a9b5cfe4-e554-40ab-a804-ee63364a96c9",
                                          {googleProjectNumber: "703436402607"},
                                          notificationOpenedCallback);
            window.plugins.OneSignal.enableInAppAlertNotification(false);
            window.plugins.OneSignal.enableNotificationsWhenActive(false);
            //window.plugins.OneSignal.sendTags({5:true});
        }
	});
})

.constant('ApiEndpoint', { url: 'http://app.berbakti.id/api' })

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 
		 'ChartJsProvider', 'ionicDatePickerProvider', '$compileProvider',
	function($stateProvider, $urlRouterProvider, $ionicConfigProvider, 
			 ChartJsProvider, ionicDatePickerProvider, $compileProvider) {

		$compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/);

		$ionicConfigProvider.backButton.text('&nbsp;').icon('ion-ios-arrow-back');
		$ionicConfigProvider.navBar.alignTitle('center');
		$ionicConfigProvider.tabs.position('top');

		$stateProvider.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'templates/register.html',
			controller: 'RegCtrl'
		})
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		})
		
		.state('app.dashboard', {
			url: '/dashboard',
			views: {
				'menuContent': {
					templateUrl: 'templates/dashboard.html',
					controller: 'dashCtrl'
				}
			}
		})

		.state('app.addParent', {
			url: '/parents/add',
			views: {
				'menuContent': {
					templateUrl: 'templates/reg-parent.html',
					controller: 'regParentCtrl'
				}
			}
		})		
        
		.state('app.parent', {
			url: '/parent/:parentId',
			views: {
				'menuContent': {
					templateUrl: 'templates/parentMenu.html',
					controller: 'ParentCtrl'
				}
			}
		})
		.state('app.parentCondition', {
			url: '/parent/:parentId/condition',
			views: {
				'menuContent': {
					templateUrl: 'templates/parentCondition.html',
					controller: 'ParentConditionCtrl'
				}
			}
		})
		.state('app.parentGraphic', {
			url: '/parent/:parentId/graphic',
			views: {
				'menuContent': {
					templateUrl: 'templates/parentGraphic.html',
					controller: 'ParentGraphicCtrl'
				}
			}
		})
		.state('app.parentProfile', {
			url: '/parent/:parentId/profile',
			views: {
				'menuContent': {
					templateUrl: 'templates/parentProfile.html',
					controller: 'ParentProfileCtrl'
				}
			}
		})

		.state('app.hospitals', {
      url: '/hospitals',
      views: {
        'menuContent': {
          templateUrl: 'templates/hospitals.html',
          controller: 'HospitalCtrl'
        }
      }
    })
        
    .state('app.articles', {
      url: '/articles',
      views: {
        'menuContent': {
          templateUrl: 'templates/articleList.html',
          controller: 'ArticlesCtrl'
        }
      }
    })        
    
    .state('app.article', {
        url: '/articles/:articleId',
        views: {
          'menuContent': {
            templateUrl: 'templates/article.html',
            controller: 'ArticleCtrl'
        }
      }
    })
        
    .state('app.profile', {
			url: '/profile',
			views: {
				'menuContent': {
					templateUrl: 'templates/userProfile.html',
					controller: 'ProfileCtrl'
				}
			}
		})
    
    .state('app.password', {
			url: '/password',
			views: {
				'menuContent': {
					templateUrl: 'templates/userPassword.html',
					controller: 'PasswordCtrl'
				}
			}
		})

		$urlRouterProvider.otherwise('/login');

		var datePickerObj = { setLabel: 'Pilih', todayLabel: 'Today', closeLabel: 'Tutup',
			mondayFirst: false, inputDate: new Date(), weeksList: ["M", "S", "S", "R", "K", "J", "S"],
			monthsList: ["Jan", "Feb", "Maret", "April", "Mei", "Juni", "Juli", "Ags", "Sept", "Okt", "Nov", "Des"],
			templateType: 'popup', showTodayButton: false, 
			dateFormat: 'dd/mm/yy', closeOnSelect: true,
			disableWeekdays: [8]
		};

	ionicDatePickerProvider.configDatePicker(datePickerObj);
	ChartJsProvider.setOptions({ colors : ['#33cd5f', '#803690', '#ffc900', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });

}]);