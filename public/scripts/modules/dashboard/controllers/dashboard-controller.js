define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService','$q', '$urlRouter', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService, $q, $urlRouter) {
       	    $rootScope.ssoId = "502450548";
       	    $rootScope.email = $rootScope.ssoId+"@mail.ad.ge.com"
       	    
    	 $scope.getRandomColor = function(id){
    		 var cardsLength =  $scope.parentCards.length; 
    			for(var i=0; i<cardsLength;i++){
    				 if(i==0){
    					 $scope.parentCards[i].bgcolor = "#005cb9"
    				 }
    				 else if(i==1){
    					 $scope.parentCards[i].bgcolor = "#8669ff"
    				 }
    				 else if(i==2){
    					 $scope.parentCards[i].bgcolor = "#ff9821"
    				 }
    				 else if(i>=3){
    					 $scope.parentCards[i].bgcolor = "#9d"+i+'0c'+i
    				 }
    				 
    			}
    	 }
    	 
    	 $scope.getSubFolders = function(dataId){
    	    	$scope.spinner = true;
    	    	$scope.cardsData = false;
    	    	$scope.subfolderData = false;
    	    	dashboardService.getSubFoldersFilesDetails(dataId).then(function(response) {
    	    		$scope.cardContent = true;
    	    		$scope.filesContent = true;
    	    		$rootScope.subFoldersFilesData = response.data;
    	    		$rootScope.allfoldersData = [];
    	    		//$rootScope.allFilesData = [];
    	    		angular.forEach(response.data.entries, function(value, key) {
    	    			if(value.type == "folder"){
    	    				$rootScope.allfoldersData.push(value);
    	    			}
    	    			/*else if(value.type == "file"){
    	    				$rootScope.allFilesData.push(value);
    	    			}*/
    	    		});
                    $scope.spinner = false;
                   $state.go('view')
                    console.log(response);
    	    	},function(error){
                	$scope.spinner = false;
                	$scope.serviceErroMsg = true;
                    $scope.errorMsgdata = "Failed to load data";
                    $('#alert').removeClass('fade-out hidden');
                });
    	   		
    	    	
    	 }
    	
    	 
    	 
    	/* $scope.getCardsData = function(){
    		 var localUrl ='/sample-data/sample-cards.json';
    		 $http.get(localUrl).success(function(data) {
                 // you can do some processing here
    			 $scope.cardsData = true;
    			 $scope.parentCards = data.folderList;
    			 $rootScope.allFilesData = data.fileList;
    			 $scope.getRandomColor();
             });
    		
    	 }
    	 $scope.getCardsData();
    	*/
    	 
    	
    	 
    	 $scope.getCards = function(){
    		 $scope.spinner = true;
     		var data = {"folderID":"0",
     				 "sso":$rootScope.ssoId,
     				"email":$rootScope.email
     				}
     		dashboardService.getCards(data).then(function (response) {
 	    		if(response!=""){
 	    			$scope.spinner=false;
 	    			 $scope.cardsData = true;
 	    			 $scope.parentCards = response.folderList;
 	    			 $scope.getRandomColor();
 	    		}
 	    		else{
 	    			$scope.errorMsgdata = "No Cards";
 	    			$('#alert').removeClass('fade-out hidden');
 	    			$scope.serviceSuccessMsg = false;
 		        	$scope.serviceErroMsg = true;
 	    		}
 	    		
 	    	},function(error){
 	        	$scope.spinner = false;
 	        	$scope.errorMsgdata = "Failed to load data";
 	        	$('#alert').removeClass('fade-out hidden');
 	        	$scope.serviceSuccessMsg = false;
 	        	$scope.serviceErroMsg = true;
 	        })
 	        
    	 }
    	 
    	 
    	 $scope.getFolders = function(dataId, folderName){
    		 $scope.spinner = true;
    		 $rootScope.folderName = folderName;
     		var data = {"folderID":dataId,
     				 "sso":$rootScope.ssoId,
     				"email":$rootScope.email
     				}
     		dashboardService.getFolders(data).then(function (response) {
 	    		if(response!=""){
 	    			 $scope.spinner=false;
 	    			
 	    			 $rootScope.allFoldersData = response.folderList;
 	    			 $rootScope.allFilesData = response.fileList;
 	    			 
 	    			 console.log(response);
 	    			 $state.go('view');
 	    			 $scope.errrorMsg== true;
 	    			 
 	    			for (var key in response) {
 	    				  if (response.hasOwnProperty("folderList") ==false && response.hasOwnProperty("fileList") ==false) {
 	    					 $scope.folderView =true;
 	 	    				 $scope.errrorMsg= true;
 	    				  }
 	    				}
 	    		}
 	    		else{
 	    			$scope.errorMsgdata = "No data";
 	    			$('#alert').removeClass('fade-out hidden');
 	    			$scope.serviceSuccessMsg = false;
 		        	$scope.serviceErroMsg = true;
 	    		}
 	    		
 	    	},function(error){
 	        	$scope.spinner = false;
 	        	$scope.errorMsgdata = "Failed to load data";
 	        	$('#alert').removeClass('fade-out hidden');
 	        	$scope.serviceSuccessMsg = false;
 	        	$scope.serviceErroMsg = true;
 	        })
 	        
    	 }
    	 
    	
    	             /* $scope.getStatesData = function(){          
    	                var $state = $rootScope.$state;
    	                var data = $rootScope.allFoldersData;
    	              
    	                    angular.forEach(data, function(value, key) {
    	                      
    	                      var getExistingState = $state.get(value.name)

    	                      if(getExistingState !== null){
    	                        return; 
    	                      }
    	                      
    	                      var state = {
    	                        "url": value.url,
    	                        "parent": value.parent,
    	                        "abstract": value.abstract,
    	                        "views": {}
    	                      };

    	                      angular.forEach(value.views, function(view) {
    	                        state.views[view.name] = {
    	                          templateUrl: view.templateUrl,
    	                        };
    	                      });

    	                      $stateProviderRef.state(value.name, state);
    	                    });
    	                    // Configures $urlRouter's listener *after* your custom listener

    	                    $urlRouter.sync();
    	                    $urlRouter.listen();
    	                    
    	                 
    	              }*/
    	 
    	 
    	  $scope.gotoDashBoard = function(){
    		  $state.go('dashboard');
    	  }
    	  $scope.gotoFileView = function(){
    		  $state.go('filesView');
    	  }
    	
    	  if($state.current.name =="filesView" ||$state.current.name =="view" ){
    		  //$scope.filesData();
    		 // $scope.getCardsData();
    		  
    	  }
    	  if($state.current.name =="dashboard" ){ 
    		  $scope.getCards();
    	  }
    }]);
});
