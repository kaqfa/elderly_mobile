angular.module('starter.services', [])

.factory('Users', function($http, ApiEndpoint) {
    var data = null;
    var token = null;

    return {
    login: function(username, password, callback, error) {
      $http.post(ApiEndpoint.url + '/login/', {username: username, password: password}).then(function(response){
        if(callback!=null)
          callback(response.data);
        token = response.data.token;
        console.log(token);
      }, function(response){
        if(error!=null)
          error(response);
      });
    },
    register: function(user, callback, error){
      user.type='c';
      $http.post(ApiEndpoint.url + '/members/', user).then(function(response){
        if(callback!=null)
          callback(response.data);
      }, function(response){
        if(error!=null)
          error(response);
      });
    },
    logout: function(){
      token=null;
      data=null;
    },
    cekLogin: function(){
      if(token==null)
        return false;
      else
        return true;
    },
    setData: function(token, callback, error){
      $http.get(ApiEndpoint.url + '/caregivers/', {
        headers: {
          Authorization: "Token "+token
        }
      }).then(function(response){
        if(callback!=null)
          callback(response.data);
        console.log(data);
      }, function(response){
        if(error!=null)
          error(response);
        console.log(response);
      });
    },
    getToken: function(){
      if(data!=null)
        return data.token;
      else
        return null;
    }
  };
})

.factory('Elders', function($http, ApiEndpoint) {
    var data = {};

    return {
    all: function(){
      return data;
    },setAll: function(token, callback, error) {
      $http.get(ApiEndpoint.url + '/elders/', {
        headers: {
          Authorization: "Token "+token
        }
      }).then(function(response){
        if(callback!=null)
          callback(response.data);
        data=response.data;
      }, function(response){
        if(error!=null)
          error(response);
      });
    },
    remove: function(elder) {
      data.splice(data.indexOf(elder), 1);
    },
    get: function(elderId) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === parseInt(elderId)) {
          return data[i];
        }
      }
      return null;
    }
  };
});