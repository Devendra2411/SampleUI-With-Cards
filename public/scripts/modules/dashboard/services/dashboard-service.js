define(['angular', '../dashboard'], function(angular, dashboardService) {
    'use strict';
    dashboardService.value('version', '0.1');
    dashboardService.factory('dashboardService', ['$q', '$rootScope','$http', 'remoteServiceManager','localDataStore', function($q, $rootScope,$http,remoteServiceManager,localDataStore) {

    	
    	  var getCardDetails = function(data){
    		  var deferred = $q.defer();
              var serviceName="sample-cards.json";
              remoteServiceManager.sendRequest(serviceName,data).then(
                  function(data){
                      deferred.resolve(data)
                  },function(err){
                      deferred.reject(err);
                  }
              )
              return deferred.promise;
    	  }
    	  var getSubFoldersFilesDetails = function(data){
    		  var deferred = $q.defer();
              var serviceName="sub-folders.json";
              remoteServiceManager.sendRequest(serviceName).then(
                  function(data){
                      deferred.resolve(data)
                  },function(err){
                      deferred.reject(err);
                  }
              )
              return deferred.promise;
    	  }
            return{
            	getCardDetails : getCardDetails,
            	getSubFoldersFilesDetails : getSubFoldersFilesDetails
            }
    }]);


    return dashboardService;

});
