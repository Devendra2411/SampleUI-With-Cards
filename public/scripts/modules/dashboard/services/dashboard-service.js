define(['angular', '../dashboard'], function(angular, dashboardService) {
    'use strict';
    dashboardService.value('version', '0.1');
    dashboardService.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
    dashboardService.service('fileUpload', ['$http','$rootScope','$state', function ($http,$rootScope,$state) {
        this.uploadFileToUrl = function(file, uploadUrl, fd){
        var parentID = $rootScope.parentID;
          fd.append('file', file);
            $http.post(uploadUrl, fd, parentID,{
                transformRequest: angular.identity,
               headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}
            })
            .success(function(data){
                	console.log(data);
            })
            .error(function(data){
            	console.log(data);
            	 });
        }
    }]);
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
    	  
    	  
    	  var getCards =  function(data){
    			var deferred = $q.defer();
    			$http.post(API_URL+"/FolderItems",data)
    				.success(function(data, status, headers) {
    					deferred.resolve(data);
    				})
    				.error(function() {
    					deferred.reject('Error fetching results ');
    				});
    			return deferred.promise;
    		};
    		
		 var getFolders =  function(data){
 			var deferred = $q.defer();
 			$http.post(API_URL+"/FolderItems",data)
 				.success(function(data, status, headers) {
 					deferred.resolve(data);
 				})
 				.error(function() {
 					deferred.reject('Error fetching results ');
 				});
 			return deferred.promise;
 		};
    	 
 		
 		
 		 var getAkanaToken =  function(){
  			var deferred = $q.defer();
  			$http.post(Akana_Url)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Akana Token not received');
  				});
  			return deferred.promise;
  		};
  		
  		
  		var fileUpload =  function(data){
  			var deferred = $q.defer();
  			$http.post(Box_API+'/files/content', data, {headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var downloadFile =  function(fileID){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/files/'+fileID+'/content', { headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}})
  				.success(function(jqXHR, textStatus, errorThrow) {
  					console.log('data', jqXHR)
  					//deferred.resolve(data);
  				}).error(function(jqXHR, textStatus, errorThrown) {
  					//window.location.href = data;
  					console.log('download error');
  					console.log(jqXHR, textStatus, errorThrown)
  					//deferred.reject('Download Failed');
  				});
  			return deferred.promise;
  		};
  		
  		
  		var getGTBToken =  function(){
  			var deferred = $q.defer();
  			$http.get(Gtb_Url,{ headers: {'Authorization': 'Bearer '+$rootScope.akanaToken}})
  				.success(function(data, status, headers) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('GTB Token not received');
  				});
  			return deferred.promise;
  		};
     	  
  		var createFolder =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/createFolder', data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
            return{
            	getCardDetails : getCardDetails,
            	getSubFoldersFilesDetails : getSubFoldersFilesDetails,
            	
            	getCards:getCards,
            	getFolders:getFolders,
            	
            	getAkanaToken:getAkanaToken,
            	getGTBToken:getGTBToken,
            	
            	downloadFile:downloadFile,
            	fileUpload:fileUpload,
            	createFolder:createFolder
            }
    }]);


    return dashboardService;

});
