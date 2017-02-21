define(['angular', '../dashboard'], function(angular, dashboardService) {
    'use strict';
    dashboardService.value('version', '0.1');
    
    /* 
     * An Angular service which helps with creating recursive directives.
     * @author Mark Lagendijk
     * @license MIT
     */
    dashboardService.factory('RecursionHelper', ['$compile', function($compile){
    	return {
    		/**
    		 * Manually compiles the element, fixing the recursion loop.
    		 * @param element
    		 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
    		 * @returns An object containing the linking functions.
    		 */
    		compile: function(element, link){
    			// Normalize the link parameter
    			if(angular.isFunction(link)){
    				link = { post: link };
    			}

    			// Break the recursion loop by removing the contents
    			var contents = element.contents().remove();
    			var compiledContents;
    			return {
    				pre: (link && link.pre) ? link.pre : null,
    				/**
    				 * Compiles and re-adds the contents
    				 */
    				post: function(scope, element){
    					// Compile the contents
    					if(!compiledContents){
    						compiledContents = $compile(contents);
    					}
    					// Re-add the compiled contents to the element
    					compiledContents(scope, function(clone){
    						element.append(clone);
    					});

    					// Call the post-linking function, if any
    					if(link && link.post){
    						link.post.apply(null, arguments);
    					}
    				}
    			};
    		}
    	};
    }]);
    dashboardService.directive("tree", function(RecursionHelper) {
        return {
            restrict: "E",
            scope: {family: '='},
             	 template: 
            	        '<p id="{{family.folderID}}" class="ItemName" ><i class="fa fa-folder-o" aria-hidden="true" ng-show="family.folderName"></i> {{ family.folderName }}</p>'+
            	        '<p id="{{family.fileID}}" class="filesData"><i class="fa fa-file-o" aria-hidden="true" ng-show="family.fileName"></i> {{ family.fileName }} </p>'+
            	            '<ul class="test">' + 
            	                '<li ng-repeat="child in family.rootFolderMap.Items[0].folderList" ng-click="toggleFolder()">' + 
            	                    '<tree family="child"></tree>' +
            	                '</li>' +
            	            '</ul>'+
            	            '<ul class="allData">' + 
            	                '<li  ng-repeat="test in family.subTreeStructureVO.rootFolderMap.Items[0].folderList">' + 
            	                    '<tree family="test"></tree>' +
            	                '</li>' +
            	                '<li  ng-repeat="test in family.subTreeStructureVO.rootFolderMap.Items[0].filesList">' + 
            	                    '<tree family="test"></tree>' +
            	                '</li>' +
            	            '</ul>',
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                    // Define your normal link function here.
                    // Alternative: instead of passing a function,
                    // you can also pass an object with 
                    // a 'pre'- and 'post'-link function.
                });
            }
        };
      })
      
      
    
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
  		
  		var subscribeUpdates =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/insertUserDetails',data)
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
            	getAllDatatemp:getAllDatatemp
            
            	
            }
    }]);

  
    return dashboardService;

});
