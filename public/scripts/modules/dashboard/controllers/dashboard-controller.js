define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService) {
    	 /* $scope.getRandomColor1 =  {
    		 "background-color": '#' + Math.floor(Math.random()*16777215).toString(16)
    	    };*/
    	/*$scope.getRandomColorCode =  {
       		 "background-color": '#' + Math.floor(Math.random()*16777215).toString(16)
       	    }*/;
       	 $scope.parentCards=[];
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
    	     /*$('#'+dataId).find('.cardContent').addClass('active').parent().siblings().children().find('.cardContent').removeClass('active')
    		 $timeout(function(){ $scope.cardContent = false; $scope.filesContent=false},400)
    		  $timeout(function(){ $scope.cardContent = true;$scope.filesContent=true; $scope.spinner = false; },500);*/
    		
    	    	
    	 }
    	
    	 
    	 
    	 $scope.getCardsData = function(){
    		 var localUrl ='/sample-data/sample-cards.json';
    		 $http.get(localUrl).success(function(data) {
                 // you can do some processing here
    			 $scope.cardsData = true;
    			 $scope.parentCards = data.folderList;
    			 $rootScope.allFilesData = data.fileList;
    			 $scope.getRandomColor();
             });
    		/* dashboardService.getCardDetails().then(function(response) {
                 $scope.spinner = false;
                 $scope.parentCards = response;
             },function(error){
             	$scope.spinner = false;
             	$scope.serviceErroMsg = true;
                 $scope.errorMsgdata = "Failed to load data";
                 $('#alert').removeClass('fade-out hidden');
             });*/
    	 }
    	 $scope.getCardsData();
    	 $scope.filesData = function(){
   		  
   	  }
    	 //$scope.foldersAndFilesData();
    	  $scope.gotoDashBoard = function(){
    		  $state.go('dashboard');
    	  }
    	  $scope.gotoFileView = function(){
    		  $state.go('filesView');
    	  }
    	 /* if($state.current.name =="dashboards"){
    		  $scope.cardsData();
    	  }*/
    	  if($state.current.name =="filesView" ||$state.current.name =="view" ){
    		  $scope.filesData();
    		  $scope.getCardsData();
    	  }
    	  if($state.current.name =="view" ){ 
    		//  $scope.getCardsData();
    	  }
    }]);
});
