angular.module('starter.services', [])

.factory('Elders', function() {
    var data = [{
      id: 1,
      name: 'Ortu 1',
      birthdate: '1980-10-10',
      gender: "L",
      phone: "7213124",
      token: "adsfadfssfda"
      
    },{
      id: 2,
      name: 'Ortu 2',
      birthdate: '1980-10-09',
      gender: "P",
      phone: "7213125",
      token: "adsfadfssfda"
    },{
      id: 3,
      name: 'Ortu 3',
      birthdate: '1979-12-10',
      gender: "L",
      phone: "7213126",
      token: "adsfadfdsfda"
    }];

    return {
      login: function(phone) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].phone == phone) {
            return data[i].token;
          }
        }
        return false;
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