// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
                           'ionic-datepicker', 'chart.js', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    var notificationOpenedCallback = function(jsonData) {
      alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    // OneSignal.setLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);

    window.plugins.OneSignal.init("6ddddad0-6453-498e-9f3e-b307b5a681b8",
                                   {googleProjectNumber: "564672218112"},
                                   notificationOpenedCallback);

    window.plugins.OneSignal.enableInAppAlertNotification(true);
  });
})

.constant('ApiEndpoint', {
    // url: 'http://localhost:8100/api'
    url: 'http://elderlyapps.net/api'
    // url: 'http://localhost:8000/api'
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/)

  $ionicConfigProvider.backButton.text('&nbsp;').icon('ion-ios-arrow-back')
  $ionicConfigProvider.navBar.alignTitle('center')
  $ionicConfigProvider.tabs.position('top')  

  $stateProvider
    .state('login', {
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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  var datePickerObj = {
      setLabel: 'Pilih',
      todayLabel: 'Today',
      closeLabel: 'Tutup',
      mondayFirst: false,
      inputDate: new Date(),
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      showTodayButton: false,
      dateFormat: 'dd MMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [8]
    };

    ionicDatePickerProvider.configDatePicker(datePickerObj);

});
