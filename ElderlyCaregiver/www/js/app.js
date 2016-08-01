// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 
	'ionic-datepicker', 'chart.js'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// var notificationOpenedCallback = function(jsonData) {
		//   alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
		// };    
		// window.plugins.OneSignal.init("6ddddad0-6453-498e-9f3e-b307b5a681b8",
		//       {googleProjectNumber: "564672218112"},
		//       notificationOpenedCallback);
		// window.plugins.OneSignal.enableInAppAlertNotification(true);
	});
})

.constant('ApiEndpoint', { url: 'http://elderlyapps.net/api' })

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
					templateUrl: 'templates/parent.html',
					controller: 'ParentCtrl'
				}
			}
		})
		.state('app.editParent', {
			url: '/parent/:parentId/edit',
			views: {
				'menuContent': {
					templateUrl: 'templates/edit.html',
					controller: 'ParentCtrl'
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
