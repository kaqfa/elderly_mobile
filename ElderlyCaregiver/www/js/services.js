angular.module('starter.services', [])

.factory('Users', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {
    var data = null;
    var token = null;

    return {
        login: function(username, password, callback, error) {
            $http.post(ApiEndpoint.url + '/login/', {username: username, password: password})
            .then(function(response){
                token = response.data.token;
                localStorage.token = token;
                data = response.data.profile;
                if(callback != null)
                  callback(response.data);
            }, function(response){
                if(error != null)
                    error(response);
            });
        },
        register: function(user, callback, error){
            user.type = 'c';
            $http.post(ApiEndpoint.url + '/members/', user).then(function(response){
                if(callback != null)
                    callback(response.data);
            }, function(response){
                if(error != null)
                    error(response);
            });
        },
        logout: function(){
            token = null;
            data = null;
            localStorage.removeItem("token");
        },
        cekLogin: function(){
            if(token == null)
                return false;
            else
                return true;
        },
        getData: function(inputToken, callback, error){
            $http.get(ApiEndpoint.url + '/profile/', {
                headers: { Authorization: "Token "+inputToken }
            }).then(function(response){
                token = inputToken;
                data = response.data;
                if(callback != null)
                    callback(response.data);
            }, function(response){
                if(error != null)
                    error(response);
            });
        },
        getToken: function(){
            if(data != null && token != null)
                return token;
            else
                return null;
        }
    };
}])

.factory('Elders', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {
    var data = [];
    var tracker = [];

    var getAllElders = function(){
        return data;
    };

    var setAllElders = function(token, callback, error){
        $http.get(ApiEndpoint.url + '/elders/', {
            headers: { Authorization: "Token "+token }
        }).then(function(response){
            data.splice(0, data.length);
            for(i=0;i<response.data.length;i++){
                data.push(response.data[i]);
                tracker[response.data[i].id]=[];
            }
            $http.get(ApiEndpoint.url + '/trackers/', {
                headers: { Authorization: "Token "+token }
            }).then(function(response){
                for(i=0;i<response.data.length;i++){
                    tracker[response.data[i].elder].push(response.data[i]);
                }
            });
            if(callback != null)
                callback(response.data);
        }, function(response){
            if(error != null)
                error(response);
        });
    };

    var addElder = function(elder, token, callback, error){      
        elder = JSON.parse(JSON.stringify(elder));
        elder.type = 'e';      
        $http.post(ApiEndpoint.url + '/members/', elder, {
            headers: { Authorization: "Token "+token }
        }).then(function(response){
            data.push(response.data);
            if(callback!=null)
                callback(response.data);
        }, function(response){
            if(error!=null)
                error(response);
        });
    };

    return {
        all: getAllElders,
        setAll: setAllElders,
        add: addElder,
        update: function(elder, token, callback, error){
            postelder = JSON.parse(JSON.stringify(elder));
            console.log(postelder);
            console.log(data[0]);
            elder = null;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].id === postelder.id){
                    elder = data[i];
                    break;
                }
            }
            console.log(elder);
            $http.patch(ApiEndpoint.url + '/elders/' + elder.id +'/', postelder, {
                headers: { Authorization: "Token "+token }
            }).then(function(response){
                console.log(response);
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].id === postelder.id){
                        data[i] = response.data;
                        break;
                    }
                }
                if(callback!=null)
                    callback(response.data);
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
                    return {elder:data[i],tracker:tracker[elderId]};
                }
            }
            return null;
        },
        refreshTrack: function(callback, error){
            $http.get(ApiEndpoint.url + '/trackers/', {
                headers: { Authorization: "Token "+token }
            }).then(function(response){
                for(i=0;i<data.length;i++){
                    tracker[data[i].id]=[]
                }
                for(i=0;i<response.data.length;i++){
                      tracker[response.data[i].elder].push(response.data[i]);
                }
                if(callback!=null)
                    callback(response.data);
            }, function(response){
                if(error!=null)
                error(response);
            });
        },
        refreshTrackElder: function(elderId, token, callback, error){
            $http.get(ApiEndpoint.url + '/trackers/?elder='+elderId, {
                headers: { Authorization: "Token "+token }
            }).then(function(response){
                tracker[elderId]=[]
                for(i=0;i<response.data.length;i++){
                    tracker[response.data[i].elder].push(response.data[i]);
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
                return "sehat";
                break;
                case "bi":
                return "kangen";
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
}]);
