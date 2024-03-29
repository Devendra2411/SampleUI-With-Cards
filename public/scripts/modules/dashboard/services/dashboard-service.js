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
    	this.uploadFileToUrl = function(file,uploadUrl, fd){
            $http.post(uploadUrl,fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
               /*headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}*/
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
    	  var authorizeUser = function(data){
      		var deferred = $q.defer();
      		  $http.post(API_URL+'/validUser', data)
                .success(function(data, status, headers) {
                    deferred.resolve(data);
                })
                .error(function() {
                    deferred.reject('Error fetching results ');
                });
      		  return deferred.promise;
      	};
    	  
    	  
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
  			$http.post(Upload_File, data, {headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}})
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
  			$http.get(Box_API+'/files/'+fileID+'?fields=download_url', { headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  					//deferred.resolve(data);
  				}).error(function(jqXHR, textStatus, errorThrown) {
  					//window.location.href = data;
  					console.log('download error');
  					console.log(jqXHR, textStatus, errorThrown)
  					//deferred.reject('Download Failed');
  				});
  			return deferred.promise;
  		};
  		
  		var previewFile =  function(fileID){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/files/'+fileID+'?fields=expiring_embed_link', { headers: {'Authorization' : 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  					//deferred.resolve(data);
  				}).error(function(jqXHR, textStatus, errorThrown) {
  					console.log(jqXHR, textStatus, errorThrown)
  					//deferred.reject('Download Failed');
  				});
  			return deferred.promise;
  		};
  		
  		var getGTBToken =  function(){
  			var deferred = $q.defer();
  			$http.post(Gtb_Url)
  				.success(function(data, status, headers) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('GTB Token not received');
  				});
  			return deferred.promise;
  		};
  		var postComment =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/postComments', data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var getComments =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/getComments', data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var deleteComment =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/deleteComment',data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		
  		var getBOXFolders =  function(dataId){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/folders/'+dataId+'/items', { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var getBOXFoldersInfo =  function(folderID){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/folders/'+folderID, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var getBOXFileInfo =  function(fileID){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/files/'+fileID, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		var createFolder =  function(data){
  			var deferred = $q.defer();
  			$http.post(Box_API+'/folders',data, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function(data) {
  					deferred.reject(data);
  				});
  			return deferred.promise;
  		};
  		var getBoxAkanaToken =  function(){
  			var deferred = $q.defer();
  			$http.post(boxAkana_Url)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Akana Token not received');
  				});
  			return deferred.promise;
  		};
  		var getHitCount =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/folderHitInfo',data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to count');
  				});
  			return deferred.promise;
  		};
  		
  		var getFileComments =  function(data){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/files/'+data+'/comments', { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to count');
  				});
  			return deferred.promise;
  		};
  		
  		var getBOXFoldersLink =  function(data, bodyData){
  			var deferred = $q.defer();
  			$http.put(Box_API+'/folders/'+data+'?fields=shared_link', bodyData, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to featch shared link data');
  				});
  			return deferred.promise;
  		};
  	
  		var getBOXFilesLink =  function(data, bodyData){
  			var deferred = $q.defer();
  			$http.put(Box_API+'/files/'+data+'?fields=shared_link',bodyData, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to featch shared link data');
  				});
  			return deferred.promise;
  		};
  		
  		var createBookmark =  function(data){
  			var deferred = $q.defer();
  			$http.post(Box_API+'/web_links',data, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to create Bookmark');
  				});
  			return deferred.promise;
  		};
  		var updateBookmark =  function(id, data){
  			var deferred = $q.defer();
  			$http.put(Box_API+'/web_links/'+id, data, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to create Bookmark');
  				});
  			return deferred.promise;
  		};
  		var deleteBookmark =  function(id){
  			var deferred = $q.defer();
  			$http.delete(Box_API+'/web_links/'+id, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to delete Bookmark');
  				});
  			return deferred.promise;
  		};
  		
  		var subscribeUpdates =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/notifyUser',data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to load');
  				});
  			return deferred.promise;
  		};
  		
  		var sendMail =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/sendMail',data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('failed to load');
  				});
  			return deferred.promise;
  		};
  		
  		var getAllData =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/treeStructure', data)
  				.success(function(data, status, headers) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Data not found');
  				});
  			return deferred.promise;
  		};
  		var getAllDatatemp =  function(){
  			var deferred = $q.defer();
  			$http.get('sample-data/sample-cards.json')
  				.success(function(data, status, headers) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Data not found');
  				});
  			return deferred.promise;
  		};
  		
  		
  		var updateDatatoDb =  function(data){
  			var deferred = $q.defer();
  			
  			$http.post(API_URL+'/folderUpdation',data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function(data) {
  					deferred.reject(data);
  				});
  			return deferred.promise;
  		};
  		
  		
  		var getProductSiteDtls=function(){
  			var deferred=$q.defer();
  			$http.get(API_URL+'/getProductSite')
  			   .success(function(data){
  				   deferred.resolve(data);
  			   })
  			 .error(function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
  			
  		};
  		var insProductSiteDtls=function(list){
  			
  			var deferred=$q.defer();
  			var data ={"productsiteList":list};
  			$http.post(API_URL+'/insertProductSite',data)
  			 .success(function(response){
  				deferred.resolve(response);
  			 })
  			 .error(function(response){
  				 deferred.reject(response);
  			 })
  			 console.log(deferred.promise);
  		
  			 return deferred.promise;
  		};
  		
  		var downloadStatistics=function(){
  			
  			var deferred=$q.defer();
  			$http.get(API_URL+'/downloadStatistics')
  			 .success(function(response){
  				 deferred.resolve(response);
  			 })
  			 .error(function(response){
  				 deferred.reject(response);
  			 })
  			 
  			 return deferred.promise;
  		};
  		var getBMDataforSiteMap =  function(dataId){
  			var deferred = $q.defer();
  			$http.get(Box_API+'/web_links/'+dataId, { headers: {'Authorization': 'Bearer '+$rootScope.gtbToken}})
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};
  		
  		var getSearchResult= function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/getSearchResult',data)
 			 .success(function(response){
 				deferred.resolve(response);
 			 })
 			 .error(function(response){
 				 deferred.reject(response);
 			 });
  			return deferred.promise;
  		};
  		
            return{
            	authorizeUser:authorizeUser,            	
            	getCards:getCards,
            	getFolders:getFolders,
            	getAkanaToken:getAkanaToken,
            	getGTBToken:getGTBToken,
            	downloadFile:downloadFile,
            	fileUpload:fileUpload,
            	createFolder:createFolder,
            	postComment:postComment,
            	deleteComment:deleteComment,
            	getBOXFolders:getBOXFolders,
            	getBOXFoldersInfo:getBOXFoldersInfo,
            	getBoxAkanaToken:getBoxAkanaToken,
            	getComments:getComments,
            	getBOXFileInfo:getBOXFileInfo,
            	createFolder:createFolder,
            	getHitCount:getHitCount,
            	getFileComments:getFileComments,
            	subscribeUpdates:subscribeUpdates,
            	sendMail:sendMail,
            	getAllData:getAllData,
            	getAllDatatemp:getAllDatatemp,
            	getBOXFoldersLink:getBOXFoldersLink,
            	getBOXFilesLink:getBOXFilesLink,
            	createBookmark:createBookmark,
            	deleteBookmark:deleteBookmark,
            	updateBookmark:updateBookmark,
            	previewFile:previewFile,
            	
            	updateDatatoDb:updateDatatoDb,
            	getProductSiteDtls:getProductSiteDtls,
               	insProductSiteDtls:insProductSiteDtls,
               	downloadStatistics:downloadStatistics,
               	getBMDataforSiteMap:getBMDataforSiteMap,
               	getSearchResult :getSearchResult
             
            }
    }]);

  
    return dashboardService;

});
