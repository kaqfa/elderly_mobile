angular.module('starter.services', [])

.factory('Elders', function($http, ApiEndpoint) {
  var data = null;
  var token = null;
  var trackers = [];
  var caregivers = [];
  var localId=0;

  return {
    login: function(phone, callback, error) {
      $http.post(ApiEndpoint.url + '/login/elder/', {phone: phone}).then(function(response){
        token = response.data.token;
        localStorage.token=token;
        data = response.data.profile;
        $http.get(ApiEndpoint.url + '/trackers/', {
          headers: {
            Authorization: "Token "+token
          }
        }).then(function(response){
          trackers.splice(0, trackers.length);
          for(i=0;i<response.data.length;i++){
            trackers.push(response.data[i]);
          }
          $http.get(ApiEndpoint.url + '/caregivers/', {
            headers: {
              Authorization: "Token "+token
            }
          }).then(function(response){
            caregivers.splice(0, caregivers.length);
            for(i=0;i<response.data.length;i++){
              caregivers.push(response.data[i]);
            }
            if(callback!=null)
              callback(response.data);
          }, function(response){
            if(error!=null)
              error(response);
          });
        }, function(response){
          if(error!=null)
            error(response);
        });
      }, function(response){
        if(error!=null)
          error(response);
      });
    },
    logout: function(){
      token=null;
      data=null;
      localStorage.removeItem("token");
    },
    cekLogin: function(){
      if(token==null)
        return false;
      else
        return true;
    },
    getData: function(inputToken, callback, error){
      $http.get(ApiEndpoint.url + '/profile/', {
        headers: {
          Authorization: "Token "+inputToken
        }
      }).then(function(response){
        token=inputToken;
        data=response.data;
        $http.get(ApiEndpoint.url + '/trackers/', {
          headers: {
            Authorization: "Token "+token
          }
        }).then(function(response){
          trackers.splice(0, trackers.length);
          for(i=0;i<response.data.length;i++){
            trackers.push(response.data[i]);
          }
          $http.get(ApiEndpoint.url + '/caregivers/', {
            headers: {
              Authorization: "Token "+token
            }
          }).then(function(response){
            caregivers.splice(0, caregivers.length);
            for(i=0;i<response.data.length;i++){
              caregivers.push(response.data[i]);
            }
            if(callback!=null)
              callback(response.data);
          }, function(response){
            if(error!=null)
              error(response);
          });
        }, function(response){
          if(error!=null)
            error(response);
        });
      }, function(response){
        if(error!=null)
          error(response);
      });
    },
    getToken: function(){
      if(data!=null&&token!=null)
        return token;
      else
        return null;
    },
    getTrackers: function(){
      return trackers;
    },
    getCaregivers: function(){
      return caregivers;
    },
    getProfile: function(){
      return data;
    },
    addTrack: function(input){
      input.localId=localId;
      localId++;
      trackers.unshift(input);
      var addLoop=function(track){
        $http.post(ApiEndpoint.url + '/trackers/', track, {
          headers: {
            Authorization: "Token "+token
          }
        }).then(function(response){
          for(i=0;i<trackers.length;i++)
            if(trackers[i].localId==input.localId){
              trackers[i]=response.data;
            }
        }, function(response){
          setTimeout(function(){
            addLoop(track);
          }, 5000);
        });
      }
      addLoop(input);
    },
    refreshTrack: function(callback, error){
      $http.get(ApiEndpoint.url + '/trackers/', {
        headers: {
          Authorization: "Token "+token
        }
      }).then(function(response){
        trackers.splice(0, trackers.length);
        for(i=0;i<response.data.length;i++){
          trackers.push(response.data[i]);
        }
        if(callback!=null)
          callback(response.data);
      }, function(response){
      if(error!=null)
        error(response);
      });
    },
    convertCondition: function(cond){
      switch(cond){
        case "ba":
          return "baik";
          break;
        case "bi":
          return "biasa";
          break;
        case "tb":
          return "tidak baik";
          break;
        case "sk":
          return "sakit kepala";
          break;
        case "sl":
          return "sakit leher";
          break;
        case "sdl":
          return "sakit dada kiri";
          break;
        case "sdr":
          return "sakit dada kanan";
          break;
        case "sll":
          return "sakit lengan kiri";
          break;
        case "slr":
          return "sakit lengan kanan";
          break;
        case "sp":
          return "sakit perut";
          break;
        case "spl":
          return "sakit paha kiri";
          break;
        case "spr":
          return "sakit paha kanan";
          break;
        case "sbl":
          return "sakit betis kiri";
          break;
        case "sbr":
          return "sakit betis kanan";
          break;
        case "stl":
          return "sakit telapak kaki kiri";
          break;
        case "str":
          return "sakit telapak kaki kanan";
          break;
        default:
          return "baik";
      }
    }
  };
})

.factory('Anatomy', function(){
  var data = [{
    name: 'human',
    show: true,
    location: false
  },{
    name: 'head',
    show: false,
    location: 'top: 0%;left: 41.5%;width: 17.5%;height: 13.4%;'
  },{
    name: 'neck',
    show: false,
    location: 'top: 13.4%;left: 39.6%;width: 22.3%;height: 4.7%;'
  },{
    name: 'armUL',
    show: false,
    location: 'top: 17.5%;right: 64.5%;width: 17%;height: 18.7%;'
  },{
    name: 'armUR',
    show: false,
    location: 'top: 17.5%;left: 64.5%;width: 17%;height: 18.7%;'
  },{
    name: 'armLL',
    show: false,
    location: 'top: 36.2%;right: 72.5%;width: 27.5%;height: 21%;'
  },{
    name: 'armLR',
    show: false,
    location: 'top: 36.2%;left: 72.5%;width: 27.5%;height: 21%;'
  },{
    name: 'chestL',
    show: false,
    location: 'top: 17.5%;right: 50%;width: 14.5%;height: 16%;'
  },{
    name: 'chestR',
    show: false,
    location: 'top: 17.5%;left: 50%;width: 14.5%;height: 16%;'
  },{
    name: 'stomach',
    show: false,
    location: 'top: 33.3%;left: 35%;width: 31%;height: 18%;'
  },{
    name: 'footL',
    show: false,
    location: 'top: 93%;right: 50.8%;width: 11%;height: 7%;'
  },{
    name: 'footR',
    show: false,
    location: 'top: 93%;left: 50.8%;width: 11%;height: 7%;'
  },{
    name: 'calfL',
    show: false,
    location: 'top: 75%;right: 50.8%;width: 12%;height: 18%;'
  },{
    name: 'calfR',
    show: false,
    location: 'top: 75%;left: 50.8%;width: 12%;height: 18%;'
  },{
    name: 'thighL',
    show: false,
    location: 'top: 51%;right: 50.8%;width: 16%;height: 24%;'
  },{
    name: 'thighR',
    show: false,
    location: 'top: 51%;left: 50.8%;width: 16%;height: 24%;'
  }];
  
  return {
    getData: function() {
      return data;
    },
    show: function(image){
      for (var i = 0; i < data.length; i++) {
        if(data[i].name == image)
          data[i].show=true;
        else
          data[i].show=false;
      }
    }
  };
});