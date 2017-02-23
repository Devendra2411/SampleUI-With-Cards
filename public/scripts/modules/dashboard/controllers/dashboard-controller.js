define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService','$q', '$urlRouter','fileUpload', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService, $q, $urlRouter, fileUpload) {
       	    //$rootScope.ssoId = "502450548";
    		//$rootScope.roleId ="1"
    		$rootScope.dataId =window.dataId; //for stage
    		//$rootScope.notifyStatus ="Yes";
    		console.log('Notify', $rootScope.notifyStatus);
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
    	 
    	 $scope.getCards= function(){
    		 $scope.spinner = true;
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    			 var dataId = $rootScope.dataId;
         	    			 dashboardService.getBOXFolders(dataId).then(function (info) {
 	     	      				if(info.total_count!="0"){
 	     	      				 $scope.spinner = false;
 	     	      				$scope.cardsData = true;
 	     	      					$scope.BoxFolders = {
 	     	 	     						  "folderID": "",
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
	     	      				//$scope.BrowserData();
 	     	      				}
 	     	      				else{
 	     	      				$scope.spinner = false;
 	              				$scope.errorMsgdata = "No Cards";
 	              				$scope.serviceSuccessMsg = false;
 	         	    			$scope.serviceError = true;
 	                            $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	     	      				}
 	     	      				
         	    			 })

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
 	 	    		 $scope.errorMsgdata = "Akana GTB token not received";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     		 console.log(JSON.stringify($scope.parentCards));
     	}
    	 $scope.getFolderHitCount= function(dataId, folderName){
    		 var data = { "sso":$rootScope.ssoId, "folderID":dataId,  "folderName":folderName}
    			dashboardService.getHitCount(data).then(function (response) {
    				if(response.statusFlag == "success"){
    					console.log(response.statusMsg);
    				}
    				else{
    					console.log('count is failed');
    				}
    			})
    	 } 
    	 $scope.getFolders= function(dataId, folderName, flag){
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
    			 if(flag=="home"){
     					var parentData = [{'id':dataId, 'name':folderName}];
     					sessionStorage.setItem("parentData", JSON.stringify(parentData));
     				}
 				else{
      				var parentData = JSON.parse(sessionStorage.getItem("parentData"));
      				var testData = 0;
      				angular.forEach(parentData, function(value, index) {
      				 var tempId =value.id;
 	    			 if(tempId==dataId){
 	    				 testData++;
 	    				 var tempData = parentData.splice(0, parentData.length-1);
 	    				 sessionStorage.setItem("parentData", JSON.stringify(tempData));
     					 }
      				})
      				
      				if(testData==0){
      					var parentItem = {'id':dataId, 'name':folderName};
    				 parentData.push(parentItem);
    				 sessionStorage.setItem("parentData", JSON.stringify(parentData));
      				}
 				}
    			 
    	 		sessionStorage.setItem("folderId", dataId);
    		 }
    		 if(folderName ==undefined){
    			 folderName = sessionStorage.getItem("folderName");
    			 $rootScope.folderName = folderName;
    		 }
    		 else if(folderName !=undefined){
     	 		sessionStorage.setItem("folderName", folderName);
     		 }
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    		 console.log('gtb_token', data);
         	    			 dashboardService.getBOXFolders(dataId).then(function (info) { 
 	     	      				if(info!=""){
 	     	      				 
 	     	      				 $scope.spinner = false;
 	     	      				$scope.folderView =false;
 	     	      			$scope.getFolderHitCount(dataId, folderName);
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
		     	 	     					      "fileVersion": "",
		     	 	     					      "comments":""
	  			 							   }
		     	 	     					$scope.BoxSubFolders.fileList.push(tempFileData);
	     	 	     					}
 	     	 	     				}
 	     	      				//$scope.addDataItem(id,name);	    	      				
	    	      				$scope.breadcrumbData();
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
 			     								var cDate = tempDate.split('T')[0] +' '+tempDate.split('T')[1].split('-')[0];
 			     								value.fileUpdatedBy =boxdata.created_by.name;
 			     								value.fileUpdatedDate =cDate;
 			     								value.fileSize =size+' MB';
 			     								value.fileVersion =boxdata.file_version.sha1;
 			     							}
 			 	     					})
 			 	     					
 			 	     					dashboardService.getFileComments(tempId).then(function (Cdata) {
 			     							if(Cdata!="" && Cdata.total_count.length!="0"){
 			     								if(Cdata.entries[0].item.id==tempId){
 			     									value.comments == Cdata.entries[0].message;
 			     								}
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
	 	    	    			$scope.spinner = false;
	         	    			 })
	      	      			
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

     	}
    	 
    	$scope.breadcrumbData = function(){
    		 $scope.namesData = JSON.parse(sessionStorage.getItem("parentData"));
    	}
    	
    	$scope.gotoView = function(id,name){
    		if(name =="Dashboard"){
    			$state.go('dashboard');
    			$scope.getCards()
    		}
    		else{
    			$scope.getFolders(id,name)
    		}
    	}
    	 $scope.craeteFolderToBox= function(flag){
    		 $scope.spinner = true;
    		 var folderID;
    		 if(flag=="home"){
    			 folderID =$rootScope.dataId
    		 }
    		 else{
    			 folderID =sessionStorage.getItem("folderId");
    			 var folderName =sessionStorage.getItem("folderName");
    		 }
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
         	    	 	 	    	    $scope.sendMail('New folder "'+$scope.FolderNameData+'" created');
         	    	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
         	    	 	 	    		$scope.FolderNameData ="";
         	    	 	 	    		$scope.successMsgdata = "Folder Created successfully";
         	    	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
         	    	 	 	        	$scope.serviceSuccess = true;
         	    	 	 	            $scope.serviceError = false;
         	    	 	 	           
         	    	    			}
         	    	    			else{
	         	   	 	 	    		$scope.getFolders();
	         	   	 	 	    		$scope.sendMail('New folder "'+$scope.FolderNameData+'" created in "'+folderName+'" folder');
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
     	}
    	 
    	 $scope.fileupload= function(){
    		 $scope.spinner = true;

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
         		         var folderName =sessionStorage.getItem("folderName");
         		         formData.set("parent_id",folderDataId);	         		        
	         		       $.ajax({
	         		    	     url: Upload_File,
						         headers: {"Authorization": "Bearer "+$rootScope.gtbToken},
						         type: 'POST',
						         processData: false,
						         contentType: false,
						         dataType : 'JSON',
						         data: formData
						         }).success (function(res, xhr, jq) {
						        	 if(res.total_count!=""){
							            	    $scope.spinner = false;
							            	    $rootScope.filename ="";
							            	    $('#uploadFile').val('');
							            	    $('#uploadBtn').val('');
									            console.log(res.responseText);
									            $scope.getFolders();
						 	 	 	    		$scope.successMsgdata = "File uploaded successfully";
						 	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
						 	 	 	        	$scope.serviceError = false;
						 	 	 	        	$scope.serviceSuccess = true;
						 	 	 	        	$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
						 	 	 	        	var fileName = res.entries[0].name
						 	 	 	        	$scope.sendMail('New File "'+fileName+'" is uploaded in "'+folderName+'" folder');
							             }
						        	 
	         		             }).error(function(res) {
	         		            	$scope.spinner = false
         		            	 	$scope.errorMsgdata = res.responseJSON.message
			 	 	 	    		$('#uploadFile').val('');
			 	 	 	    		$('#uploadBtn').val('');
			 	 	 	    	    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
			 	 	 	    	    $scope.serviceSuccess = false;
			 	 	 	        	$scope.serviceError = true;
			 	 	 	            $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
			 	 	 	            $state.go('view');
		 	    	    			$scope.spinner = false;
			 	 	 	            
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

     	}


    	 
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
    			    $('#uploadFile').val('');
	            	$('#uploadBtn').val('');
    			    
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
 		}
    	 
    	 $scope.postComment = function(){
    		 $scope.spinner = true;
    		 var folderID =sessionStorage.getItem("folderId");
    		 var folderName = sessionStorage.getItem("folderName");
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
 	            $scope.sendMail($rootScope.ssoId+ ' posted a comment for "'+folderName +'" folder');
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
    	
    	
      
    	
    	$scope.getGpsContent= function(){
   		 $scope.spinner = true;
   		 dashboardService.getGTBToken().then(function (data) {
 			if(data!=null){
 				$rootScope.gtbToken = data.accessToken;
	    		 console.log('gtb_token', data);
	    			 var dataId = $rootScope.dataId;
	    			 dashboardService.getBOXFolders(dataId).then(function (info) {
 	      				if(info.total_count!="0"){
 	      				 $scope.spinner = false;
 	      				$scope.cardsData = true;
 	      					$scope.BoxFoldersData = {
 	 	     						  "folderID": "",
 	 	     						  "folderName":"GPS",
 	 	     						  "parentData": []
 	 	     					}
 	 	     				for(var i=0; i<info.entries.length; i++){
 	 	     					var tempId =info.entries[i].id;
 	 	     					var tempFolderData = { 
			 	     						"folderID": info.entries[i].id,
			 							      "folderName": info.entries[i].name,
			 							      "totalCount":"0",
			 							     "children": []
			 							   }
 	 	     					$scope.BoxFoldersData.parentData.push(tempFolderData);
 	 	     				}
 	      				angular.forEach($scope.BoxFoldersData.parentData, function(value, index) {
     	      				 var tempId =value.folderID;
        	    			 if(tempId!=""){
	     						dashboardService.getBOXFoldersInfo(tempId).then(function (boxdata) {
	     							if(boxdata!="" && boxdata.id==tempId){
	     								value.totalCount = boxdata.item_collection.total_count;
	     								/*if(boxdata.item_collection.entries.length!="0"){
	     									$scope.getGpsSubContent(tempId);
	     								}*/
	     							}
	 	     					})
	     					}
 	      				})
 	      				$scope.roleList =$scope.BoxFoldersData.parentData;
 	      				console.log('roleList', JSON.stringify($scope.roleList));
 	      				
 	      				}
 	      				else{
 	      				$scope.spinner = false;
          				$scope.errorMsgdata = "No Cards";
          				$scope.serviceSuccessMsg = false;
     	    			$scope.serviceError = true;
                        $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	      				}
 	      				
	    			 })

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
	    		 $scope.errorMsgdata = "Akana GTB token not received";
	    		 $scope.serviceSuccess = false;
             $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 		})
    	};
    	
    	
    	
    	
       	
       	$scope.subscribeUpdates= function(){
     		 $scope.spinner = true;
     		 var data = {"sso":$rootScope.ssoId}
     		 dashboardService.subscribeUpdates(data).then(function (data) {
   			if(data!=null){
   				if(data.statusFlag=="success"){
	   					$scope.spinner = false;
	   					$rootScope.notifyStatus ="No";
	   					$scope.successMsgdata = "You have subscribed updates";
	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
	 	 	        	$scope.serviceSuccess = true;
	 	 	        	$scope.serviceError = false;
	 	 	        	console.log('notifyStatus2', $rootScope.notifyStatus);
   				}
   				else{
   					$scope.spinner = false;
    				$scope.errorMsgdata = "Failed";
    				$scope.serviceSuccessMsg = false;
    				$scope.serviceError = true;
                    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
   				}
   				 
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
      	};
      	
    	
    	$scope.sendMail= function(content){
    		var data = {"message": content}
    		 dashboardService.sendMail(data).then(function (data) {
  			 console.log('mail updates',data);
  		 })
    		 };
		 
		 $scope.getTreeData2= function(){
			 $scope.spinner = true
			 dashboardService.getAllDatatemp().then(function (data) {
				 $scope.spinner = false
				 $scope.treeData = data;
			 });
		 };
		 $scope.toggleFolder = function(id){
			 $('#'+id).next().next().find('li.folderData').toggle('slow')
			 $('#'+id).next().next().find('li.filesData').toggle('slow')
			 
		 }
		 $scope.getTreeData= function(){
			 $scope.treeData= [];
			 $scope.spinner = true;
			 var data = {'folderID' : window.dataId};
			 dashboardService.getAllData(data).then(function (data) {
				 $scope.spinner = false;
				 $scope.treeData = data;
			 });
		 };
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
    		  $scope.addFile();
    		  $rootScope.folderID = sessionStorage.getItem("folderId");
    	  }
    	  
    	  if($state.current.name =="dashboard" ){ 
    		  $scope.getCards();
    		  //$scope.getTreeData();
    		
    		  sessionStorage.removeItem('parentData');
    	
    	  }
    	  
    	  
    }]);
});
