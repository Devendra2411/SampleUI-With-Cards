define(['angular', '../dashboard'], function(angular, remoteServiceManager) {
    'use strict';

    remoteServiceManager.value('version', '0.1');

    remoteServiceManager.factory('remoteServiceManager', ['$q', '$rootScope','$http', function($q, $rootScope, $http) {

            var sendRequest = function(serviceName,requestParams){

                var deferred = $q.defer();

                   var serverUrl = '/sample-data/'+serviceName;

                    $http.get(serverUrl, requestParams).success(function(data){

                        deferred.resolve({'success':true,'data':data});

                    }).error(function(err){

                        deferred.reject({'success':false,'error':err});

                    })

                return deferred.promise;

            }
          
            return{
                sendRequest:sendRequest
            }

        }]);


    return remoteServiceManager;
});
