angular.module('starter.services', [])

.factory('Users', function() {
    var data = [{
        id: 1,
        username: 'asd',
        password: '12345678',
        token: 'AKcnsaK35jN6Z'
    }];

    return {
    login: function(username, password) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].username == username && data[i].password == password) {
          return data[i].token;
        }
      }
      return false;
    },
    register: function(user){
      return 'AKcnsaK35jN6Z';
    }
  };
})

.factory('Elders', function() {
    var data = [{
      id: 1,
      name: 'Ortu 1',
      birthdate: '1980-10-10',
      gender: "L",
      phone: "7213123"
    },{
      id: 2,
      name: 'Ortu 2',
      birthdate: '1980-10-09',
      gender: "P",
      phone: "7213123"
    },{
      id: 3,
      name: 'Ortu 3',
      birthdate: '1979-12-10',
      gender: "L",
      phone: "7213123"
    }];

    return {
    all: function() {
      return data;
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