define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService','$q', '$urlRouter','fileUpload', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService, $q, $urlRouter, fileUpload) {
       	    //$rootScope.ssoId = "502450548";
    		//$rootScope.roleId ="1"
       	    $rootScope.email = $rootScope.ssoId+"@mail.ad.ge.com"
       	    
    	 $scope.getRandomColor = function(id){
    		 var cardsLength =  $scope.parentCards.length; 
    		 var colors =["#005eb8","#63666a","#00b5e2","#13294b", "#b1b3b4"]
    			for(var i=0; i<cardsLength;i++){
    				 if(i==0){
    					 $scope.parentCards[i].bgcolor = "#005eb8"
    				 }
    				 else if(i==1){
    					 $scope.parentCards[i].bgcolor = "#63666a"
    				 }
    				 else if(i==2){
    					 $scope.parentCards[i].bgcolor = "#00b5e2"
    				 } 
    				 else if(i==3){
    					 $scope.parentCards[i].bgcolor = "#13294b"
    				 }
    				 else if(i==4){
    					 $scope.parentCards[i].bgcolor = "#b1b3b4"
    				 }
    				 else if(i=>5){
    					 $scope.parentCards[i].bgcolor = colors[Math.floor(Math.random() * colors.length)];
    				 }
    				 
    				 
    			}
    	 }
       	 $scope.userActions = function(){
 			$( document ).on( "click", ".actionBtn", function(e) {
 				 $('.accessActionMenu').hide();
	 			$rootScope.fileID = $(this).attr("value");
	 		    $('.accessActionMenu').css({top:0,left:0});
	 			var pos = $(this).offset();
	 			pos.top = pos.top;
	 			pos.left = pos.left-120;
	 		    $('.accessActionMenu').css({position:"absolute"});
	     		$('.accessActionMenu').show();
	     		$('.accessActionMenu').offset( pos );
 			});
 			$(document).mouseup(function (e) {
                var container = $(".accessActionMenu");
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    container.hide();
                }
            });
       	 };
       	 $scope.textOnly = function(){
       		 var text = $scope.FolderNameData
       		 var transformedInput = text.replace(/[^a-zA-Z]/g, '');
       		if (transformedInput !== text) {
       			$scope.FolderNameData = transformedInput
       		}
       		return transformedInput;
       		
       		
       	 }
    	 
    	 /*$scope.getCards = function(){
    		 $scope.spinner = true;
     		var data = {"folderID":"0",
     				 "sso":$rootScope.ssoId,
     				"email":$rootScope.email
     				}
     		dashboardService.getCards(data).then(function (response) {
 	    		if(response!=""){
 	    			$scope.spinner=false;
 	    			 $scope.cardsData = true;
 	    			 $rootScope.parentCards = response.folderList;
 	    			 $scope.getRandomColor();
 	    			//$scope.getFolderData();
 	    			 $rootScope.ParentfolderID ="0";
 	    			 $rootScope.ParentfolderName ="Dashboard"
 	    		     sessionStorage.setItem("ParentfolderID",  '0');
 	    			 sessionStorage.setItem("ParentfolderName",  'Dashboard');
 	    		}
 	    		else{
 	    			$scope.errorMsgdata = "No Cards";
 	    			$scope.serviceError = true;
                    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	    		}
 	    		
 	    	},function(error){
 	        	$scope.spinner = false;
 	        	$scope.errorMsgdata = "Failed to load data";
 	        	$scope.serviceError = true;
                $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
 	        
    	 }*/

    	 $scope.getCards= function(){
    		 $scope.spinner = true;
     		dashboardService.getAkanaToken().then(function (response) {
     			$rootScope.akanaToken = response.access_token;
     			console.log('getAkanaToken', response);
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    		 if(response!=""){
         	    			 var dataId ="0"
         	    			 dashboardService.getBOXFolders(dataId).then(function (info) { 
 	     	      				if(info!=""){
 	     	      				 $scope.spinner = false;
 	     	      				$scope.cardsData = true;
 	     	      					//$scope.BoxFolderData = info.entries;
 	     	      					//$rootScope.parentCards = info.entries;
 	     	      				
 	     	      					$scope.BoxFolders = {
 	     	 	     						  "folderID": "0",
 	     	 	     						  "folderList": []
 	     	 	     					}
 	     	 	     				for(var i=0; i<info.entries.length; i++){
 	     	 	     					var tempId =info.entries[i].id;
 	     	 	     					var tempFolderData = { 
      			 	     						"folderID": info.entries[i].id,
      			 							      "folderName": info.entries[i].name,
      			 							      "totalCount":"0" 
      			 							   }
 	     	 	     					$scope.BoxFolders.folderList.push(tempFolderData);
 	     	 	     				}
 	     	      				}
 	     	      				angular.forEach($scope.BoxFolders.folderList, function(value, index) {
 		     	      				 var tempId =value.folderID;
 		        	    			 if(tempId!=""){
 			     						dashboardService.getBOXFoldersInfo(tempId).then(function (boxdata) {
 			     							if(boxdata!="" && boxdata.id==tempId){
 			     								value.totalCount = boxdata.item_collection.total_count
 			     							}
 			 	     					})
 			     					}
 	     	      				})
 	     	      				$rootScope.parentCards =$scope.BoxFolders.folderList;
 	     	      				$scope.getRandomColor();
 	     	      				
         	    			 })
         	    			 
      	      				}
          			}
          			else{
          				 $scope.spinner = false;
          				$scope.errorMsgdata = "No Cards";
          				$scope.serviceSuccessMsg = false;
     	    			$scope.serviceError = true;
                        $('#serviceErroMsg #alert').removeClass('fade-out hidden');
          			}
  	    		},function(error){
 	 	    		 $scope.spinner = false
 	 	    		 $scope.serviceError = true;
 	 	    		 $scope.errorMsgdata = "Failed";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     		})
     		 console.log(JSON.stringify($scope.parentCards));
     	}
    	 
    	 $scope.getFolders= function(dataId, folderName){
    		 $scope.spinner = true;
    		 $scope.folderView =true;
    		 $rootScope.folderName = folderName;
    		 $rootScope.folderID = dataId;
    		 //sessionStorage.setItem("ParentfolderID", dataId);
    		 $rootScope.ParentfolderID = sessionStorage.getItem("folderId");
			 $rootScope.ParentfolderName = sessionStorage.getItem("folderName");
    		 if(dataId ==undefined){
    			 dataId = sessionStorage.getItem("folderId");
    		 }
    		 else if(dataId !=undefined){
    	 		sessionStorage.setItem("folderId", dataId);
    		 }
    		 if(folderName ==undefined){
    			 folderName = sessionStorage.getItem("folderName");
    			 $rootScope.folderName = folderName;
    		 }
    		 else if(folderName !=undefined){
     	 		sessionStorage.setItem("folderName", folderName);
     		 }
     		dashboardService.getAkanaToken().then(function (response) {
     			$rootScope.akanaToken = response.access_token;
     			console.log('getAkanaToken', response);
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    		 if(response!=""){
         	    			 dashboardService.getBOXFolders(dataId).then(function (info) { 
 	     	      				if(info!=""){
 	     	      				 $scope.spinner = false;
 	     	      				$scope.folderView =false;    	      				
 	     	      					$scope.BoxSubFolders = {
 	     	 	     						  "folderID": dataId,
 	     	 	     						  "folderList": [],
 	     	 	     						  "fileList":[]
 	     	 	     					}
 	     	 	     				for(var i=0; i<info.entries.length; i++){
 	     	 	     					var tempId =info.entries[i].id;
 	     	 	     					if(info.entries[i].type =="folder"){
 	     	 	     						var tempFolderData = { 
      			 	     						"folderID": info.entries[i].id,
      			 							      "folderName": info.entries[i].name,
      			 							      "totalCount":"0",
      			 							      "folderSize":""
      			 							   }
 	     	 	     					$scope.BoxSubFolders.folderList.push(tempFolderData);
 	     	 	     					}
	 	     	 	     				if(info.entries[i].type =="file"){
		     	 	     						var tempFileData = { 
	  			 	     						"fileID": info.entries[i].id,
	  			 							      "fileName": info.entries[i].name,
	  			 							      "fileUpdatedBy": "",
		     	 	     					      "fileUpdatedDate": "",
		     	 	     					      "fileSize": "",
		     	 	     					      "fileVersion": "" 
	  			 							   }
		     	 	     					$scope.BoxSubFolders.fileList.push(tempFileData);
	     	 	     					}
 	     	 	     				}
 	     	      				}
 	     	      				angular.forEach($scope.BoxSubFolders.folderList, function(value, index) {
 		     	      				 var tempId =value.folderID;
 		        	    			 if(tempId!=""){
 			     						dashboardService.getBOXFoldersInfo(tempId).then(function (boxdata) {
 			     							if(boxdata!="" && boxdata.id==tempId){
 			     								var folderSize = (boxdata.size / (1024*1024)).toFixed(2);
 			     								value.totalCount = boxdata.item_collection.total_count;
 			     								value.folderSize = folderSize+' MB';
 			     							}
 			 	     					})
 			     					}
 	     	      				})
 	     	      				angular.forEach($scope.BoxSubFolders.fileList, function(value, index) {
 		     	      				 var tempId =value.fileID;
 		        	    			 if(tempId!=""){
 			     						dashboardService.getBOXFileInfo(tempId).then(function (boxdata) {
 			     							if(boxdata!="" && boxdata.id==tempId){
 			     								var size = (boxdata.size / (1024*1024)).toFixed(2);
 			     								var tempDate = boxdata.created_at;
 			     								var tempItem = tempDate.split('T');
 			     								var cDate = tempItem[0];
 			     								value.fileUpdatedBy =boxdata.created_by.name;
 			     								value.fileUpdatedDate =cDate;
 			     								value.fileSize =size+' MB';
 			     								value.fileVersion =boxdata.file_version.sha1;
 			     							}
 			 	     					})
 			     					}
 	     	      				})
 	     	      				$rootScope.allFoldersData =$scope.BoxSubFolders.folderList;
 	     	      			    $rootScope.allFilesData =$scope.BoxSubFolders.fileList;
	 	     	      			$rootScope.parentID =dataId;
	 	    	    			for(var i=0; i<$rootScope.allFilesData.length; i++){
	 	    	    				$rootScope.allFilesData[i].actions="";
	 	    	    				$rootScope.allFilesData[i].actions = '<button style="background: none;border: none" value="'+$rootScope.allFilesData[i].fileID+'"  class="actionBtn flex flex--center flex--middle style-scope aha-table"><i class="fa fa-bars" aria-hidden="true"></i></button>';
	 	    	    			};
	 	    	    			$scope.getCommentsData(dataId);
	 	    	    			$state.go('view');
	         	    			 })
	      	      			}
          			}
          			else{
          				 $scope.spinner = false;
          				$scope.errorMsgdata = "No Data";
          				$scope.serviceSuccessMsg = false;
     	    			$scope.serviceError = true;
                        $('#serviceErroMsg #alert').removeClass('fade-out hidden');
          			}
  	    		},function(error){
 	 	    		 $scope.spinner = false
 	 	    		 $scope.serviceError = true;
 	 	    		 $scope.errorMsgdata = "Failed";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     		})
     		 console.log(JSON.stringify($scope.BoxSubFolders));
     	}
    	 
    	 $scope.craeteFolderToBox= function(flag){
    		 $scope.spinner = true;
    		 var folderID;
    		 if(flag=="home"){
    			 folderID ="0"
    		 }
    		 else{
    			 folderID =sessionStorage.getItem("folderId");
    		 }
     		dashboardService.getAkanaToken().then(function (response) {
     			$rootScope.akanaToken = response.access_token;
     			console.log('getAkanaToken', response);
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    			 var data = {"name": $scope.FolderNameData, "parent": {"id": folderID}}
         	    			 dashboardService.createFolder(data).then(function (response) { 
         	    				$scope.spinner = false;
         	    	    		if(response.type!="error"){
         	    	    			if(flag=="home"){
         	    	 	 	    		$scope.getCards();
         	    	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
         	    	 	 	    		$scope.FolderNameData ="";
         	    	 	 	    		$scope.successMsgdata = "Folder Created successfully";
         	    	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
         	    	 	 	        	$scope.serviceSuccess = true;
         	    	 	 	            $scope.serviceError = false;
         	    	    			}
         	    	    			else{
	         	   	 	 	    		$scope.getFolders();
	         	   	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
	         	   	 	 	    		$scope.FolderNameData ="";
	         	   	 	 	    		console.log('createFolder', response);
	         	   	 	 	    		$scope.successMsgdata = "Folder Created successfully";
	         	   	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
	         	   	 	 	        	$scope.serviceSuccess = true;
	         	   	 	 	        	$scope.serviceError = false;
         	    	    			}
         	    	    		}
         	    			 },function(error){
         	    				 $scope.spinner = false
        	   	 	    		 $scope.serviceError = true;
        	   	 	    		 $scope.errorMsgdata = error.message;
        	   	 	    		 $scope.serviceSuccess = false;
        	   	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
         	  	    		})
         	    			 
      	      				}
  	    		},function(error){
 	 	    		 $scope.spinner = false
 	 	    		 $scope.serviceError = true;
 	 	    		 $scope.errorMsgdata = "Failed";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     		})
     	}
    	 
    	 $scope.fileupload= function(){
    		 $scope.spinner = true;
     		dashboardService.getAkanaToken().then(function (response) {
     			$rootScope.akanaToken = response.access_token;
     			console.log('getAkanaToken', response);
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				 $rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    		 var formData = new FormData($('#files')[0]);
         		         var fileBody = $scope.uploads;
         		         var filetype = fileBody.type
         		         var filename =fileBody.name
         			     var blob = new Blob([fileBody], { type: filetype});
         			     formData.append('file', blob, filename);
         		         var folderDataId = sessionStorage.getItem("folderId");
         		         formData.set("parent_id",folderDataId);
         		         var tempAjaxUpload = $.ajax({
         								         url: Upload_File,
         								         headers: {"Authorization": "Bearer "+$rootScope.gtbToken},
         								         type: 'POST',
         								         processData: false,
         								         contentType: false,
         								         dataType : 'JSON',
         								         data: formData
         								         }).complete(function (data) {
         								        	 $scope.spinner = false;
         								             if(data.statusText=="Created"){
         							 	 	 	    		$scope.filename ="";
         							 	 	 	    		$scope.file="";
         										            console.log(data.responseText);
         										            $scope.getFolders();
         							 	 	 	    		$scope.successMsgdata = "File uploaded successfully";
         							 	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
         							 	 	 	        	$scope.serviceError = false;
         							 	 	 	        	$scope.serviceSuccess = true;
         							 	 	 	        	$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
         							 	 	 	            
         								             }
         								             else{	 $scope.spinner = false;
         										            console.log(data.responseText);
         							 	 	 	    		$scope.errorMsgdata = "Upload Failed";
         							 	 	 	    		$scope.filename ="";
         							 	 	 	    		$scope.file="";
         							 	 	 	    	    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
         							 	 	 	    	    $scope.serviceSuccess = false;
         							 	 	 	        	$scope.serviceError = true;
         							 	 	 	         $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
         							 	 	 	            
         								             }
         								         });
         	    			 
      	      				}
          			else{
          				 $scope.spinner = false;
          				$scope.errorMsgdata = "Failed";
          				$scope.serviceSuccessMsg = false;
     	    			$scope.serviceError = true;
                        $('#serviceErroMsg #alert').removeClass('fade-out hidden');
          			}
  	    		},function(error){
 	 	    		 $scope.spinner = false
 	 	    		 $scope.serviceError = true;
 	 	    		 $scope.errorMsgdata = "Failed";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     		})
     	}
    	 
    	 /* $scope.fileupload = function(){
         	 $scope.spinner = true;
 	    	 var getakana= dashboardService.getAkanaToken();
 	    	 getakana.then(function(result){
 		         var formData = new FormData($('#files')[0]);
 		         var fileBody = $scope.uploads;
 		         var filetype = fileBody.type
 		         var filename =fileBody.name
 			      var blob = new Blob([fileBody], { type: filetype});
 			      formData.append('file', blob, filename);
 		         var folderDataId = sessionStorage.getItem("folderId");
 		         //formData.set("name", $rootScope.filename);
 		         formData.set("parent_id",folderDataId);
 		         var tempAjaxUpload = $.ajax({
 								         url: Upload_File,
 								         headers: {"Authorization": "Bearer "+$rootScope.gtbToken},
 								         type: 'POST',
 								         processData: false,
 								         contentType: false,
 								         dataType : 'JSON',
 								         data: formData
 								         }).complete(function (data) {
 								        	 $scope.spinner = false;
 								             if(data.statusText=="Created"){
 							 	 	 	    		$scope.filename ="";
 							 	 	 	    		$scope.file="";
 										            console.log(data.responseText);
 										            $scope.getFolders();
 							 	 	 	    		$scope.successMsgdata = "File uploaded successfully";
 							 	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
 							 	 	 	        	$scope.serviceError = false;
 							 	 	 	        	$scope.serviceSuccess = true;
 							 	 	 	        	$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
 							 	 	 	            
 								             }
 								             else{	 $scope.spinner = false;
 										            console.log(data.responseText);
 							 	 	 	    		$scope.errorMsgdata = "Upload Failed";
 							 	 	 	    		$scope.filename ="";
 							 	 	 	    		$scope.file="";
 							 	 	 	    	    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 							 	 	 	    	    $scope.serviceSuccess = false;
 							 	 	 	        	$scope.serviceError = true;
 							 	 	 	         $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
 							 	 	 	            
 								             }
 								         });
 	    	 })
          }*/
    	  
    	 $scope.getCommentsData = function(dataId){
    		 $scope.spinner = true;
    		var data = {"folderID":dataId}
    		 dashboardService.getComments(data).then(function (response) {
      				$scope.spinner = false;
     				$rootScope.commentsData = response;
     				$scope.MoreCommentsData();

  	    		},function(error){
  	    		 $scope.spinner = false
  	    		 $scope.serviceError = true;
  	    		})
    	 }

    	 $scope.getParentIDandName = function(){
    		 var dataId; var folderName;
    		 $rootScope.ParentfolderID = sessionStorage.getItem("ParentfolderID");
    		 $scope.getFolders($rootScope.ParentfolderID, folderName);
    	 }
    	 /*$scope.getFolders = function(dataId, folderName){
    		 $scope.spinner = true;
    		 $scope.folderView =true;
    		 $rootScope.folderName = folderName;
    		 $rootScope.folderID = dataId;
    		 //sessionStorage.setItem("ParentfolderID", dataId);
    		$rootScope.ParentfolderID = sessionStorage.getItem("folderId");
			 $rootScope.ParentfolderName = sessionStorage.getItem("folderName");
			 sessionStorage.setItem("ParentfolderID",  $rootScope.ParentfolderID);
			 sessionStorage.setItem("ParentfolderName",  $rootScope.ParentfolderName);
    		 if(dataId ==undefined){
    			 dataId = sessionStorage.getItem("folderId");
    		 }
    		 else if(dataId !=undefined){
    	 		sessionStorage.setItem("folderId", dataId);
    		 }
    
    		 if(folderName ==undefined){
    			 folderName = sessionStorage.getItem("folderName");
    			 $rootScope.folderName = folderName;
    		 }
    		 else if(folderName !=undefined){
     	 		sessionStorage.setItem("folderName", folderName);
     		 }
     		var data = {"folderID":dataId,
     				 "sso":$rootScope.ssoId,
     				"email":$rootScope.email
     				}
     		dashboardService.getFolders(data).then(function (response) {
 	    		if(response!=""){
 	    			 $scope.spinner=false;
 	    			 $scope.folderView =false;
 	    			
 	    			 $rootScope.allFoldersData = response.folderList;
 	    			 $rootScope.allFilesData = response.fileList;
 	    			$rootScope.commentsData = response.commentsList;
 	    			 $rootScope.parentID =dataId;
 	    			for(var i=0; i<$rootScope.allFilesData.length; i++){
 	    				$rootScope.allFilesData[i].actions="";
 	    				$rootScope.allFilesData[i].actions = '<button style="background: none;border: none" value="'+$rootScope.allFilesData[i].fileID+'"  class="actionBtn flex flex--center flex--middle style-scope aha-table"><i class="fa fa-bars" aria-hidden="true"></i></button>';
 	    				//var val=$('button.actionBtn').attr("value").split(',');
 	    			};
 	    			$scope.MoreCommentsData();
 	    			 console.log(response);
 	    			 $state.go('view');
 	    			 $scope.errrorMsg== true;
 	
 	    		}
 	    		else{
 	    			$scope.errorMsgdata = "No data";
 	    			$scope.serviceError = true;
                    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	    		}
 	    		
 	    	},function(error){
 	        	$scope.spinner = false;
 	        	$scope.errorMsgdata = "Failed to load data";
 	        	$scope.serviceError = true;
                $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
 	        
    	 }*/
    	 
    	 
    	
    	 
    	 
    	 $scope.getAkanaToken = function(){
     		dashboardService.getAkanaToken().then(function (response) {
 	    		 if(response!=null){
 	    			$rootScope.akanaToken = response.access_token;
 	    			 $scope.getGTBToken();
 	 	    		 console.log('akana_token', response);
 	    			 
 	    		 }
 	    	},function(error){
 	        	$scope.errorMsgdata = "Akana token not received";
 	        	$scope.serviceError = true;
                $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
 	        
    	 }
    	 
    	 $scope.getGTBToken = function(){
    		dashboardService.getGTBToken().then(function (response) {
     			if(response!=null){
     				$rootScope.gtbToken = response.accessToken;
    	    		 console.log('gtb_token', response);
     			}
 	    	},function(error){
 	           	$scope.errorMsgdata = "GTB token not received";
 	           $scope.serviceError = true;
               $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
 	        
    	 }
    	 $scope.getFileDownload = function(){
    		 $scope.spinner = true;
    		 $scope.getAkanaToken();
    		 $('.accessActionMenu').hide();
    		 var fileID = $rootScope.fileID;
     		dashboardService.downloadFile(fileID).then(function (response) {
     			 $scope.spinner = false;
 	    		 window.open(response.download_url, '_blank');
 	    		 console.log('downloadFile', response);
 	    	},function(error){
 	    		 $scope.spinner = false
 	        	$scope.errorMsgdata = "Download Failed";
 	        	$('#alert').removeClass('fade-out hidden');
 	        	$scope.serviceSuccessMsg = false;
 	        	$scope.serviceError = true;
 	        })
    	 };
    	 
         
         $scope.addFile= function(){
        	 document.getElementById('uploadBtn').onchange = uploadOnChange;
        	 function uploadOnChange() {
        		    var filename = this.value;
        		    var lastIndex = filename.lastIndexOf("\\");
        		    if (lastIndex >= 0) {
        		    	$rootScope.filename = filename.substring(lastIndex + 1);
        		    }
        		    document.getElementById('uploadFile').value = $rootScope.filename;
        		}
         }
       
                
         

    	
    	 $scope.popupWindow = function(){
    			var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
    			//$('button[data-modal-id]').click(function(e) {
    			    $("body").append(appendthis);
    			    $(".modal-overlay").fadeTo(500, 0.7);
    			    var modalBox = "popup";
    			    $('#'+modalBox).fadeIn($(this).data());
    			 // });  
    			  
    			$(".closeBtn, .btnClose, .actionbuttons, .js-modal-close").click(function() {
    			  $(".modal-box, .modal-overlay").fadeOut(500, function() {
    			    $(".modal-overlay").remove();
    			    $scope.filename ="";
    			    $scope.file ="";
    			    
    			  });
    			});
    			
    			$(window).resize(function() {
    			  $(".modal-box").css({
    			    top: "10%",
    			    left: "20%"
    			  });
    			});
    			$(window).resize();
    			//$scope.saveProcesDefaultdata();
    		}
    	 $scope.folderPopup = function(){
 			var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
 			//$('button[data-modal-id]').click(function(e) {
 			    $("body").append(appendthis);
 			    $(".modal-overlay").fadeTo(500, 0.7);
 			    var modalBox = "folderPopup";
 			    $('#'+modalBox).fadeIn($(this).data());
 			 // });  
 			  
 			$(".closeBtn, .btnClose, .actionbuttons, .js-modal-close").click(function() {
 			  $(".modal-box, .modal-overlay").fadeOut(500, function() {
 			    $(".modal-overlay").remove();
 			    $scope.FolderNameData="";
 			    
 			  });
 			});
 			
 			$(window).resize(function() {
 			  $(".modal-box").css({
 			    top: "10%",
 			    left: "20%"
 			  });
 			});
 			$(window).resize();
 			//$scope.saveProcesDefaultdata();
 		}
    	 /*$scope.craeteFolderToBox = function(flag){
    		 $scope.spinner = true;
    		 var folderID;
    		 if(flag=="home"){
    			 folderID ="0"
    		 }
    		 else{
    			 folderID =sessionStorage.getItem("folderId");
    		 }
    		 var data = {
    				 "folderID":folderID,
    				 "sso":$rootScope.ssoId,
      				 "email":$rootScope.email,
    				 "folderList": [{
    				       "folderName": $scope.FolderNameData 
    				     }]
    				 }
     		dashboardService.createFolder(data).then(function (response) {
     			 $scope.spinner = false;
 	    		if(response!=""){
 	    			if(flag=="home"){
 	 	 	    		$scope.getCards();
 	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
 	 	 	    		$scope.FolderNameData ="";
 	 	 	    		console.log('createFolder', response);
 	 	 	    		$scope.successMsgdata = "Folder Created successfully";
 	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
 	 	 	        	$scope.serviceSuccess = true;
 	 	 	            $scope.serviceError = false;
 	    			}
 	    			else{
	 	 	    		$scope.getFolders();
	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
	 	 	    		$scope.FolderNameData ="";
	 	 	    		console.log('createFolder', response);
	 	 	    		$scope.successMsgdata = "Folder Created successfully";
	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
	 	 	        	$scope.serviceSuccess = true;
	 	 	        	$scope.serviceError = false;
 	    			}
 	    		}
 	    		
 	    	},function(error){
 	    		 $scope.spinner = false
 	    		 $scope.serviceError = true;
 	    		 $scope.errorMsgdata = "Failed";
 	    		 $scope.serviceSuccess = false;
                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
    	 };*/
    	 
    	 $scope.postComment = function(){
    		 $scope.spinner = true;
    		 var folderID =sessionStorage.getItem("folderId");
    		 var data = {"commentsList":[{
    				                    "folderID":folderID,
    				                     "comment":$scope.commentData,
    				                     "primaryCommentID":null,
    				                     "commentCreated_by":$rootScope.ssoId,
    				                     "commentType":"C"
    				                  }]
    				              }

     		dashboardService.postComment(data).then(function (response) {
     			$scope.spinner = false;
				$rootScope.commentResponse = response;
				$scope.getCommentsData(folderID);
 	    		$scope.commentData ="";
 	    		$scope.successMsgdata = "Comment posted successfully";
 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
 	        	$scope.serviceSuccess = true;
 	            $scope.serviceError = false;
 	    		},function(error){
 	    		 $scope.spinner = false
 	    		 $scope.serviceError = true;
                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
    	 };
    	 $scope.deleteComment = function(id){
    		$scope.spinner = true;
    		var dataId = sessionStorage.getItem("folderId");
    		var data = { "commentID":id}
     		dashboardService.deleteComment(data).then(function (response) {
     			$scope.spinner = false;
     			$scope.getCommentsData(dataId);
 	    		$scope.successMsgdata = "Comment is deleted successfully";
 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
 	        	$scope.serviceSuccess = true;
 	            $scope.serviceError = false;
 	    		},function(error){
 	    		 $scope.spinner = false
 	    		$scope.serviceSuccess = false;
 	    		 $scope.serviceError = true;
 	    		
                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
    	 };
    	$scope.MoreCommentsData = function(){
    		var CommentsData = $rootScope.commentsData // json data
        	var pagesShown = 1;
        	var pageSize = 3;
        	$scope.paginationLimit = function(CommentsData) {
        	 return pageSize * pagesShown;
        	};

        	$scope.hasMoreItemsToShow = function() {
        	 return pagesShown < (CommentsData.length / pageSize);
        	};

        	$scope.showMoreItems = function() {
        	 pagesShown = pagesShown + 1;       
        	}; 
    	}
    	
    	
    	$scope.getBOXAkanaToken = function(){
    		//$scope.spinner = true;
    		dashboardService.getBoxAkanaToken().then(function (response) {
    			$rootScope.akanaToken = response.access_token;
     			dashboardService.getGTBToken().then(function (response) {
         			if(response!=null){
         				$rootScope.gtbToken = response.accessToken;
        	    		 console.log('gtb_token', response);
         			}
 	    		},function(error){
 	    		 //$scope.spinner = false
 	    		})
    		})
    	}
    	
    	$scope.BrowserData = function(){
		 $rootScope.browserContextData =[]
		  for(var i=0; i< $rootScope.parentCards.length; i++){
			 
			 var temp = {
					"name": $rootScope.parentCards[i].folderName,
    	            "identifier": "001-"+i,
    	            "isOpenable": true
			 }
			 
			$rootScope.browserContextData.push(temp);

		 }
		 console.log($rootScope.browserContextData);
		 var initialContexts = {
  	          data:$rootScope.browserContextData,
  	          meta: {
  	            parentId: null // the id of the asset of the tree above
  	          }
  	        };
  	 		console.log('initialContexts', initialContexts);
  	          var colBrowser = document.querySelector('px-context-browser');
  	          colBrowser.handlers = {
  	            getChildren: function(parent, newIndex) {
  	              return demoGetChildren(parent, newIndex)
  	            },
  	            itemOpenHandler: function(context) {
  	              console.log('Opened: ', context);
  	            }
  	          };
  	         
  	        colBrowser.initialContexts = initialContexts;
  	        function demoGetChildren(node, rangeStart) {
  	          var nodeId = node.identifier;
  	          var deferred = $q.defer();
  	          if (!rangeStart) {
  	            rangeStart = 0;
  	          }
  	          var lotsOfChildren = {
  	            data: [{
  	              "name": "A",
  	              "identifier": "001-1a"
  	            }, {
  	              "name": "B",
  	              "identifier": "001-1b"
  	            }],
  	            meta: {
  	              parentId: '001-1'
  	            }
  	          };
  	          var deepNestedChildren = {
  	            data: [{
  	              "name": "Nested Child",
  	              "identifier": "001-2a",
  	              "isOpenable": true
  	            }],
  	            meta: {
  	              parentId: '001-2'
  	            }
  	          };

  	          var deepNestedGrandchildren = {
  	            data: [{
  	              "name": "Nested Grandchild",
  	              "identifier": "001-2aa",
  	              "isOpenable": true
  	            }],
  	            meta: {
  	              parentId: '001-2a'
  	            }
  	          };

  	          var deepNestedGreatGrandchild = {
  	            data: [{
  	              "name": "Nested Great Grandchild",
  	              "identifier": "001-2aaa",
  	              "isOpenable": true
  	            }],
  	            meta: {
  	              parentId: '001-2aa'
  	            }
  	          };

  	          var children;

  	          if (nodeId === "001-1") {
  	            children = lotsOfChildren;
  	            var rangeEnd = Math.min(rangeStart + 9, children.data.length); //groups of nine
  	            children.data = children.data.slice(rangeStart, rangeEnd);
  	          }
  	          else if (nodeId === "001-2") {
  	            children = deepNestedChildren;
  	          }
  	          else if (nodeId === "001-2a") {
  	            children = deepNestedGrandchildren;
  	          }
  	          else if (nodeId === "001-2aa") {
  	            children = deepNestedGreatGrandchild;
  	          }
  	          else {
  	            children = {
  	              data: [],
  	              meta: {
  	                parentId: nodeId
  	              }
  	            };
  	          }

  	          deferred.resolve(children);

  	          return deferred.promise;
  	        }
	 }
    	 //$scope.getAkanaToken();
    	 $scope.addFile();
    	 $scope.gotoDashBoard = function(){
    		  $state.go('dashboard');
    	  }
    	  $scope.gotoFileView = function(){
    		  $state.go('filesView');
    	  }
    	
    	  if($state.current.name =="view" ){
    		  //$scope.filesData();
    		 // $scope.getCardsData();
    		  $scope.userActions();
    		  $scope.getFolders();
    		  $rootScope.folderID = sessionStorage.getItem("folderId");
    	  }
    	  if($state.current.name =="dashboard" ){ 
    		  $scope.getCards();
    		  //$scope.getBOXFoldersData();
    	  }
    }]);
});
