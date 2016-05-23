// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant('ApiEndpoint', {    
    url: 'http://elderlyapps.net/api' 
    // url: 'http://localhost:8000/api' 
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashCtrl'
  })
  
  .state('kondisi', {
    url: '/kondisi',
    templateUrl: 'templates/kondisi.html',
    controller: 'KondisiCtrl'
  })
  
  .state('anatomi', {
    url: '/anatomi',
    templateUrl: 'templates/anatomi.html',
    controller: 'AnatomiCtrl'
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

