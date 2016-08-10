angular.module('starter.services', [])

.factory('Articles', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {
    var perpage=10
    var articles=[]
    var page=1
    var count=0
    var getnum=function(inputToken, callback, error){
        $http.get(ApiEndpoint.url + '/article/?page='+1+'&page_size='+1, {
            headers: { Authorization: "Token "+inputToken }
        }).then(function(response){
            if(callback != null)
                callback(response.data);
        }, function(response){
            if(error != null)
                error(response);
        });
    }
    
    var getLatest=function(inputToken, callback, error) {
        getnum(inputToken, function(data){
            if(data.count!=count){
                $http.get(ApiEndpoint.url + '/article/?page='+1+'&page_size='+(page*perpage), {
                    headers: { Authorization: "Token "+inputToken }
                }).then(function(response){
                    articles.splice(0, articles.length)
                    for(i=0;i<response.data.results.length;i++){
                        articles.push(response.data.results[i]);
                    }
                    num=response.data.count
                    if(callback != null)
                        callback(response.data);
                    page=page+1;
                }, function(response){
                    if(error != null)
                        error(response);
                });
            }else if(data.count!=0){
                $http.get(ApiEndpoint.url + '/article/?page='+page+'&page_size='+perpage, {
                    headers: { Authorization: "Token "+inputToken }
                }).then(function(response){
                    for(i=0;i<response.data.results.length;i++){
                        articles.push(response.data.results[i]);
                    }
                    num=response.data.count
                    if(callback != null)
                        callback(response.data);
                    page=page+1;
                }, function(response){
                    if(error != null)
                        error(response);
                });
            }else{
                if(callback != null)
                    callback(data);
            }
        }, function(response){
            if(error != null)
                error(response);
        });
        
    }
    
    var getAllArticles=function(){
        return articles;
    }
    
    var get=function(articleId) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(articleId)) {
                return articles[i];
            }
        }
        return null;
    }
    
    var refresh=function(inputToken, callback, error) {
        getnum(inputToken, function(data){
            if(data.count!=count){
                $http.get(ApiEndpoint.url + '/article/?page='+1+'&page_size='+((page-1)*perpage), {
                    headers: { Authorization: "Token "+inputToken }
                }).then(function(response){
                    articles.splice(0, articles.length)
                    for(i=0;i<response.data.results.length;i++){
                        articles.push(response.data.results[i]);
                    }
                    num=response.data.count
                    if(callback != null)
                        callback(response.data);
                }, function(response){
                    if(error != null)
                        error(response);
                });
            }else{
                if(callback != null)
                    callback(data);
            }
        }, function(response){
            if(error != null)
                error(response);
        });
        
    }
    var loadFirst=function(inputToken, callback, error){
        if(page==1&&count==0)
            getLatest(inputToken, callback, error);
    }
    
    var reset=function(pp){
        articles.splice(0, articles.length);
        page = 1;
        count = 0;
        perpage=pp;
    }
    var setPerPage=function(pp){
        perpage=pp
    }
    
    return {
    reset: reset,
    setPerPage: setPerPage,
    getAll: getAllArticles,
    getLatest: getLatest,
    loadFirst: loadFirst,
    refresh: refresh,
    get: get
  };
}])
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
            window.plugins.OneSignal.getTags(function(tags) {
                var unsub=[];
                for(keys in tags){
                    unsub.push(keys);
                }
                window.plugins.OneSignal.deleteTags(unsub);
            });
        },
        cekLogin: function(){
            if(token == null){
                return false;
            }else{
                return true;
            }
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
            subscription={}
            for(i=0;i<response.data.length;i++){
                data.push(response.data[i]);
                tracker[response.data[i].id]=[];
                subscription[response.data[i].id]=true;
            }
            window.plugins.OneSignal.getTags(function(tags) {
                var unsub=[];
                for(keys in tags)
                    unsub.push(keys);
                window.plugins.OneSignal.deleteTags(unsub);
                setTimeout(function(){
                    window.plugins.OneSignal.sendTags(subscription);
                },5000); 
            });
            $http.get(ApiEndpoint.url + '/trackers/', {
                headers: { Authorization: "Token "+token }
            }).then(function(response){
                console.log(response.data);
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
            subscription={}
            subscription[response.data.id]=true;
            window.plugins.OneSignal.sendTags(subscription);
            if(callback!=null)
                callback(response.data);
        }, function(response){
            if(error!=null)
                error(response);
        });
    };
    
    var joinElder = function(phone, token, callback, error){ 
        $http.post(ApiEndpoint.url + '/elders/join/', phone, {
            headers: { Authorization: "Token "+token }
        }).then(function(response){
            data.push(response.data);
            subscription={}
            subscription[response.data.id]=true;
            window.plugins.OneSignal.sendTags(subscription);
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
        join: joinElder,
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
        addTrackElder: function(track){
            tracker[track.elder].push(track);
        },
        uploadPhoto: function(elder, token, photo, callback, error){
            var ft=new FileTransfer();
            var params={
                elder: elder.id
            }
            var headers={
                Authorization: "Token "+token
            }
            var options = new FileUploadOptions();
            var filename=photo.substr(photo.lastIndexOf('/') + 1);
            var re = /(?:\.([^.]+))?$/;
            ext=re.exec(filename)[1];
            if(ext==undefined)
                ext="jpg"
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 3;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            options.fileKey = "upload";
            options.fileName = "elder"+randomstring+"."+ext;
            options.params = params;
            options.headers = headers;
            ft.upload(photo, encodeURI(ApiEndpoint.url + '/elders/photo/'), function(r){
                newElder=JSON.parse(r.response);
                for(i=0;i<data.length;i++){
                    if(newElder.id==data[i].id)
                        data[i].photo=newElder.photo
                    break;
                }
                if(callback!=null)
                    callback(data[i]);
            }, function(r){
                if(error!=null)
                    error(r);
            }, options);
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
