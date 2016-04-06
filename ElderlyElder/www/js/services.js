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
});