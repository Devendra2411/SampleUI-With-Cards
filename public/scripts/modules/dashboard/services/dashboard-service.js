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
    		 //fd.append('file', file);
    		/* var parentID = $rootScope.parentID;
        var multipartFormData = {
        	      attributes: {"name":file, "parent":{"id":parentID}},
        	      content: fd
        	  };

        
        fd.append('file', file);*/
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
  			$http.get(Gtb_Url,{ headers: {'Authorization': 'Bearer '+$rootScope.akanaToken}})
  				.success(function(data, status, headers) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('GTB Token not received');
  				});
  			return deferred.promise;
  		};
     	  
  		/*var createFolder =  function(data){
  			var deferred = $q.defer();
  			$http.post(API_URL+'/createFolder', data)
  				.success(function(data) {
  					deferred.resolve(data);
  				})
  				.error(function() {
  					deferred.reject('Failed');
  				});
  			return deferred.promise;
  		};*/
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
            	createFolder:createFolder
            }
    }]);

    window._arrayBufferToBase64 = function(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };
    
    dashboardService.directive('baseSixtyFourInput', ['$window', '$q', function($window, $q) {
       var isolateScope = {
         onChange: '&',
         onAfterValidate: '&',
         parser: '&'
       };

       var FILE_READER_EVENTS = ['onabort', 'onerror', 'onloadstart', 'onloadend', 'onprogress', 'onload'];
       for (var i = FILE_READER_EVENTS.length - 1; i >= 0; i--) {
         var e = FILE_READER_EVENTS[i];
         isolateScope[e] = '&';
       }

       return {
         restrict: 'A',
         require: 'ngModel',
         scope: isolateScope,
         link: function(scope, elem, attrs, ngModel) {

           /* istanbul ignore if */
           if (!ngModel) {
             return;
           }

           var rawFiles = [];
           var fileObjects = [];

           elem.on('change', function(e) {

             if (!e.target.files.length) {
               return;
             }

             fileObjects = [];
             fileObjects = angular.copy(fileObjects);
             rawFiles = e.target.files; // use event target so we can mock the files from test
             _readFiles();
             _onChange(e);
             _onAfterValidate(e);
           });

           function _readFiles() {
             var promises = [];
             var i;
             for (i = rawFiles.length - 1; i >= 0; i--) {
               // append file a new promise, that waits until resolved
               rawFiles[i].deferredObj = $q.defer();
               promises.push(rawFiles[i].deferredObj.promise);
               // TODO: Make sure all promises are resolved even during file reader error, otherwise view value wont be updated
             }

             // set view value once all files are read
             $q.all(promises).then(_setViewValue);

             for (i = rawFiles.length - 1; i >= 0; i--) {
               var reader = new $window.FileReader();
               var file = rawFiles[i];
               var fileObject = {};

               fileObject.filetype = file.type;
               fileObject.filename = file.name;
               fileObject.filesize = file.size;
               
               _attachEventHandlers(reader, file, fileObject);
               reader.readAsArrayBuffer(file);
             }
           }

           function _onChange(e) {
             if (attrs.onChange) {
               scope.onChange()(e, rawFiles);
             }
           }

           function _onAfterValidate(e) {
             if (attrs.onAfterValidate) {
               // wait for all promises, in rawFiles,
               //   then call onAfterValidate
               var promises = [];
               for (var i = rawFiles.length - 1; i >= 0; i--) {
                 promises.push(rawFiles[i].deferredObj.promise);
               }
               $q.all(promises).then(function() {
                 scope.onAfterValidate()(e, fileObjects, rawFiles);
               });
             }
           }

           function _attachEventHandlers(fReader, file, fileObject) {

             for (var i = FILE_READER_EVENTS.length - 1; i >= 0; i--) {
               var e = FILE_READER_EVENTS[i];
               if (attrs[e] && e !== 'onload') { // don't attach handler to onload yet
                 _attachHandlerForEvent(e, scope[e], fReader, file, fileObject);
               }
             }

             fReader.onload = _readerOnLoad(fReader, file, fileObject);
           }

           function _attachHandlerForEvent(eventName, handler, fReader, file, fileObject) {
             fReader[eventName] = function(e) {
               handler()(e, fReader, file, rawFiles, fileObjects, fileObject);
             };
           }

           function _readerOnLoad(fReader, file, fileObject) {

             return function(e) {

               var buffer = e.target.result;
               var promise;

               // do not convert the image to base64 if it exceeds the maximum
               // size to prevent the browser from freezing
               var exceedsMaxSize = attrs.maxsize && file.size > attrs.maxsize * 1024;
               if (attrs.doNotParseIfOversize !== undefined && exceedsMaxSize) {
                 fileObject.base64 = null;
               } else {
                 fileObject.base64 = $window._arrayBufferToBase64(buffer);
               }

               if (attrs.parser) {
                 promise = $q.when(scope.parser()(file, fileObject));
               } else {
                 promise = $q.when(fileObject);
               }

               promise.then(function(fileObj) {
                 fileObjects.push(fileObj);
                 // fulfill the promise here.
                 file.deferredObj.resolve();
               });

               if (attrs.onload) {
                 scope.onload()(e, fReader, file, rawFiles, fileObjects, fileObject);
               }

             };

           }

           function _setViewValue() {
             var newVal = attrs.multiple ? fileObjects : fileObjects[0];
             ngModel.$setViewValue(newVal);
             _maxsize(newVal);
             _minsize(newVal);
             _maxnum(newVal);
             _minnum(newVal);
             _accept(newVal);
           }

           ngModel.$isEmpty = function(val) {
             return !val || (angular.isArray(val) ? val.length === 0 : !val.base64);
           };

           // http://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
           scope._clearInput = function() {
             elem[0].value = '';
           };

           scope.$watch(function() {
             return ngModel.$viewValue;
           }, function(val, oldVal) {
             if (ngModel.$isEmpty(oldVal)) {
               return; }
             if (ngModel.$isEmpty(val)) {
               scope._clearInput();
             }
           });

           // VALIDATIONS =========================================================

           function _maxnum(val) {
             if (attrs.maxnum && attrs.multiple && val) {
               var valid = val.length <= parseInt(attrs.maxnum);
               ngModel.$setValidity('maxnum', valid);
             }
             return val;
           }

           function _minnum(val) {
             if (attrs.minnum && attrs.multiple && val) {
               var valid = val.length >= parseInt(attrs.minnum);
               ngModel.$setValidity('minnum', valid);
             }
             return val;
           }

           function _maxsize(val) {
             var valid = true;

             if (attrs.maxsize && val) {
               var max = parseFloat(attrs.maxsize) * 1000;

               if (attrs.multiple) {
                 for (var i = 0; i < val.length; i++) {
                   var file = val[i];
                   if (file.filesize > max) {
                     valid = false;
                     break;
                   }
                 }
               } else {
                 valid = val.filesize <= max;
               }
               ngModel.$setValidity('maxsize', valid);
             }

             return val;
           }

           function _minsize(val) {
             var valid = true;
             var min = parseFloat(attrs.minsize) * 1000;

             if (attrs.minsize && val) {
               if (attrs.multiple) {
                 for (var i = 0; i < val.length; i++) {
                   var file = val[i];
                   if (file.filesize < min) {
                     valid = false;
                     break;
                   }
                 }
               } else {
                 valid = val.filesize >= min;
               }
               ngModel.$setValidity('minsize', valid);
             }

             return val;
           }

           function _accept(val) {
             var valid = true;
             var regExp, exp, fileExt;
             if (attrs.accept) {
               exp = attrs.accept.trim().replace(/[,\s]+/gi, "|").replace(/\./g, "\\.").replace(/\/\*/g, "/.*");
               regExp = new RegExp(exp);
             }

             if (attrs.accept && val) {
               if (attrs.multiple) {
                 for (var i = 0; i < val.length; i++) {
                   var file = val[i];
                   fileExt = "." + file.filename.split('.').pop();
                   valid = regExp.test(file.filetype) || regExp.test(fileExt);

                   if (!valid) {
                     break; }
                 }
               } else {
                 fileExt = "." + val.filename.split('.').pop();
                 valid = regExp.test(val.filetype) || regExp.test(fileExt);
               }
               ngModel.$setValidity('accept', valid);
             }

             return val;
           }

         }
       };

     }
   ]);
    return dashboardService;

});
