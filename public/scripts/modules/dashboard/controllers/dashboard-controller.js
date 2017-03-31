define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService','$q', '$urlRouter','fileUpload', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService, $q, $urlRouter, fileUpload) {
       	    //$rootScope.ssoId = "502450548";
    		//$rootScope.roleId ="1"
    		$rootScope.dataId =window.dataId; //for stage
    		//$rootScope.notifyStatus ="Yes";
    		console.log('userData',$rootScope.ssoId, $rootScope.roleId, $rootScope.notifyStatus);
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
	 			$rootScope.shareurl = $(this).attr("id");
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
       		 var transformedInput = text.replace(/[^a-zA-Z]*$/, '');
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
      			 							      "totalCount":"0",
      			 							      "shared_link":""
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
			 	     					/*var bodyData = {"shared_link": {"access": "company"}};
			 	     					dashboardService.getBOXFoldersLink(tempId, bodyData).then(function (dataLinks) {
			     							if(dataLinks!="" && dataLinks.id==tempId){
			     								value.shared_link = dataLinks.shared_link.url;
			     							}
			 	     					})*/
			     					}
	     	      				})
	     	      				$rootScope.parentCards =$scope.BoxFolders.folderList;
	     	      				$scope.getRandomColor();
	     	      				$timeout(function(){
	     	      					$scope.rearrangeCards();
	     	      					if($rootScope.roleId=="2"){
		     	         				  $('.totalFiles.share').hide();
		     	         			  }
	     	      				}, 100);
 	     	      				}
 	     	      				else{
 	     	      				$scope.spinner = false;
 	              				$scope.errorMsgdata = "No Cards";
 	              				$scope.serviceSuccessMsg = false;
 	         	    			$scope.serviceError = true;
 	                            $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	     	      				}
 	     	      				
         	    			 });

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
    	 $scope.rearrangeCards = function(){
    		 $scope.spinner = true;
    		 $("#3").insertBefore("#0");
    		 $("#1").insertBefore("#0");
    		 $("#2").insertBefore("#0");
    		 $( "<div class='clear'></div>" ).insertAfter( "#3" );
    		 $( "<div class='clear'></div>" ).insertAfter( "#2" );
    		 $( "<div class='clear'></div>" ).insertAfter( "#0" );
    		 $scope.spinner = false;
    		 
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
    			 else if(flag=="sitemap"){
  					var parentData = [{'id':dataId, 'name':folderName}];
  					//sessionStorage.setItem("parentData", JSON.stringify(parentData));
  					$scope.getSitemapBCdata(dataId);
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
 	     	      				document.querySelector('px-app-nav').markSelected('/dashboard');
 	     	      				 $scope.spinner = false;
 	     	      				$scope.folderView =false;
 	     	      			$scope.getFolderHitCount(dataId, folderName);
 	     	      					$scope.BoxSubFolders = {
 	     	 	     						  "folderID": dataId,
 	     	 	     						  "folderList": [],
 	     	 	     						  "fileList":[],
 	     	 	     						  "bookmarks":[]
 	     	 	     					}
 	     	 	     				for(var i=0; i<info.entries.length; i++){
 	     	 	     					var tempId =info.entries[i].id;
 	     	 	     					if(info.entries[i].type =="folder"){
 	     	 	     						var tempFolderData = { 
      			 	     						"folderID": info.entries[i].id,
      			 							      "folderName": info.entries[i].name,
      			 							      "totalCount":"0",
      			 							      "folderSize":"",
      			 							   	  "shared_link":""
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
		     	 	     					      "comments":"",
		     	 	     					      "shared_link":""
	  			 							   }
		     	 	     					$scope.BoxSubFolders.fileList.push(tempFileData);
	     	 	     					}
		 	     	 	     			if(info.entries[i].type =="web_link"){
	     	 	     						var tempBmdata = { 
					 	     					  "fileID": info.entries[i].id,
				 							      "fileName": info.entries[i].name,
				 							      "description": info.entries[i].description,
				 							     "url": info.entries[i].url
				 							   }
	     	 	     						$scope.BoxSubFolders.bookmarks.push(tempBmdata);
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
 			 	     					});
 			     						/*var bodyData = {"shared_link": {"access": "company"}};
 			     						dashboardService.getBOXFoldersLink(tempId, bodyData).then(function (links) {
 			     							if(links!="" && links.id==tempId){
 			     								value.shared_link = links.shared_link.url;
 			     							}
 			 	     					});*/
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
 			     							if(Cdata!="" && Cdata.total_count!="0"){
 			     								if(Cdata.entries[0].item.id==tempId){
 			     									value.comments == Cdata.entries[0].message;
 			     								}
 			     							}
 			 	     					});
 			     						/*var bodyData = {"shared_link": {"access": "company"}};
 			     						dashboardService.getBOXFilesLink(tempId, bodyData).then(function (linksData) {
 			     							if(linksData!="" && linksData.id==tempId){
 			     								value.shared_link = linksData.shared_link.url;
 			     							}
 			 	     					});*/
 			     					}
 	     	      				})
 	     	      				$rootScope.allFoldersData =$scope.BoxSubFolders.folderList;
 	     	      			    $rootScope.alltempFilesData =$scope.BoxSubFolders.fileList;
	 	     	      			$rootScope.parentID =dataId;
 	    	    			    for(var i=0; i<$rootScope.alltempFilesData.length; i++){
	 	    	    				$rootScope.alltempFilesData[i].actions="";
	 	    	    				$rootScope.alltempFilesData[i].actions = '<button style="background: none;border: none" id="'+$rootScope.alltempFilesData[i].shared_link+'"  value="'+$rootScope.alltempFilesData[i].fileID+'"  class="actionBtn flex flex--center flex--middle style-scope aha-table"><i class="fa fa-bars" aria-hidden="true"></i></button>';
 	    	    			    };
	 	    	    			$rootScope.allFilesData = $rootScope.alltempFilesData;
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
    	 $scope.getFileDownload = function(fileID){
    		 $scope.spinner = true;
    		 if(fileID!=undefined){
    			 $rootScope.fileID = fileID;
    		 }
    		 else{
    			 var fileID = $rootScope.fileID; 
    		 }
    		 $('.accessActionMenu').hide();
    		 
    		 dashboardService.getGTBToken().then(function (data) {
       			if(data!=null){
       				$rootScope.gtbToken = data.accessToken;
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
       			}
       			
    		 }),function(error){
 	    		 $scope.spinner = false
  	        	$scope.errorMsgdata = "GTB Token not received";
  	        	$('#alert').removeClass('fade-out hidden');
  	        	$scope.serviceSuccessMsg = false;
  	        	$scope.serviceError = true;
  	        }     		
    	 };
    	 
    	 $scope.getFilePreview = function(fileID){
    		 $scope.spinner = true;
    		 dashboardService.getGTBToken().then(function (data) {
       			if(data!=null){
       				$rootScope.gtbToken = data.accessToken;
       				dashboardService.previewFile(fileID).then(function (response) {
            			 $scope.spinner = false;
        	    		 window.open(response.expiring_embed_link.url+'?[query_parameter]=true', '_blank');
        	    		 console.log('PreviewFile', response);
        	    	},function(error){
        	    		 $scope.spinner = false
        	        	$scope.errorMsgdata = "Preview Not available";
        	        	$('#alert').removeClass('fade-out hidden');
        	        	$scope.serviceSuccessMsg = false;
        	        	$scope.serviceError = true;
        	        })
       			}
       			
    		 }),function(error){
 	    		 $scope.spinner = false
  	        	$scope.errorMsgdata = "GTB Token not received";
  	        	$('#alert').removeClass('fade-out hidden');
  	        	$scope.serviceSuccessMsg = false;
  	        	$scope.serviceError = true;
  	        }     		
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
    			var appendthis =  ("<div class='modal-overlay'></div>");
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
 			var appendthis =  ("<div class='modal-overlay'></div>");
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
    	 $scope.openBox = function(id, flag){
    		 $('#copyTarget').val("");
    		 $('.copyTextItem').hide();
    		 if(id==undefined || id==""){
    			 $scope.tempDataID ="";
    			 $scope.tempFlag = "";
    		 }
    		 else{
    			 $scope.tempDataID =id;
    			 $scope.tempFlag = flag;
    		 }
    		 
    		 var appendthis =  ("<div class='modal-overlay'></div>");
   			//$('button[data-modal-id]').click(function(e) {
   			    $("body").append(appendthis);
   			    $(".modal-overlay").fadeTo(500, 0.7);
   			    var modalBox = "urlpopup";
   			    $('#'+modalBox).fadeIn($(this).data());
   			 // });  
   			  
   			$("#urlpopup .js-modal-close").click(function() {
   				$('.copyTextItem').hide();
   			  $(".modal-box, .modal-overlay").fadeOut(500, function() {
   			    $(".modal-overlay").remove();
   				 $('#copyTarget').val();
   				
   			    
   			  });
   			});
   			
   			$(window).resize(function() {
   			  $(".modal-box").css({
   			    top: "10%",
   			    left: "20%"
   			  });
   			});
   			$(window).resize();
   			
    	 };
    		
    		 $scope.getShareLink = function(value){
    			 if($scope.tempDataID ==""){
    				 if(value =="c"){
    					 $scope.spinner=true;
    	    			 var bodyData = {"shared_link": {"access": "company"}};
    	    			 dashboardService.getBOXFilesLink($rootScope.fileID, bodyData).then(function (linksData) {
    							if(linksData!=""){
    								 $scope.spinner=false;
    								 $('#copyTarget').val(linksData.shared_link.url);
    							}
    						},function(error){
    	       	    		$scope.spinner = false
    	     	        	$scope.errorMsgdata = "Download Failed";
    	     	        	$('#alert').removeClass('fade-out hidden');
    	     	        	$scope.serviceSuccessMsg = false;
    	     	        	$scope.serviceError = true;
    	     	        });
    	    			  
    				 }
    				 else if(value=="f"){
    					 $scope.spinner=true;
    	    			 var bodyData = {"shared_link": {"access": "collaborators"}};
    	    			 dashboardService.getBOXFilesLink($rootScope.fileID, bodyData).then(function (linksData) {
    							if(linksData!=""){
    								 $scope.spinner=false;
    								 $('#copyTarget').val(linksData.shared_link.url);
    							}
    						},function(error){
    	       	    		$scope.spinner = false
    	     	        	$scope.errorMsgdata = "Download Failed";
    	     	        	$('#alert').removeClass('fade-out hidden');
    	     	        	$scope.serviceSuccessMsg = false;
    	     	        	$scope.serviceError = true;
    	     	        });
    	    			 
    				 }
    			 }
    			 else if($scope.tempDataID !="" && $scope.tempFlag!=""){
    				 if(value =="c"){
    					 $scope.spinner=true;
    	    			 var bodyData = {"shared_link": {"access": "company"}};
    	    			 dashboardService.getBOXFoldersLink($scope.tempDataID, bodyData).then(function (linksData) {
    							if(linksData!=""){
    								 $scope.spinner=false;
    								 $('#copyTarget').val(linksData.shared_link.url);
    							}
    						},function(error){
    	       	    		$scope.spinner = false
    	     	        	$scope.errorMsgdata = "Failed";
    	     	        	$('#alert').removeClass('fade-out hidden');
    	     	        	$scope.serviceSuccessMsg = false;
    	     	        	$scope.serviceError = true;
    	     	        });
    	    			  
    				 }
    				 else if(value=="f"){
    					 $scope.spinner=true;
    	    			 var bodyData = {"shared_link": {"access": "collaborators"}};
    	    			 dashboardService.getBOXFoldersLink($scope.tempDataID, bodyData).then(function (linksData) {
    							if(linksData!=""){
    								 $scope.spinner=false;
    								 $('#copyTarget').val(linksData.shared_link.url);
    							}
    						},function(error){
    	       	    		$scope.spinner = false
    	     	        	$scope.errorMsgdata = "Failed";
    	     	        	$('#alert').removeClass('fade-out hidden');
    	     	        	$scope.serviceSuccessMsg = false;
    	     	        	$scope.serviceError = true;
    	     	        });
    	    			 
    				 }
    				 
    			 }
	    		 
	    	 };

    	 
    	 $scope.copyUrl = function(){
    		 $('.copyTextItem').show();
    		 copyToClipboard(document.getElementById("copyTarget"));

    			function copyToClipboard(elem) {
    				  // create hidden text element, if it doesn't already exist
    			    var targetId = "_hiddenCopyText_";
    			    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    			    var origSelectionStart, origSelectionEnd;
    			    if (isInput) {
    			        // can just use the original source element for the selection and copy
    			        target = elem;
    			        origSelectionStart = elem.selectionStart;
    			        origSelectionEnd = elem.selectionEnd;
    			    } else {
    			        // must use a temporary form element for the selection and copy
    			        target = document.getElementById(targetId);
    			        if (!target) {
    			            var target = document.createElement("textarea");
    			            target.style.position = "absolute";
    			            target.style.left = "-9999px";
    			            target.style.top = "0";
    			            target.id = targetId;
    			            document.body.appendChild(target);
    			        }
    			        target.textContent = elem.textContent;
    			    }
    			    // select the content
    			    var currentFocus = document.activeElement;
    			    target.focus();
    			    target.setSelectionRange(0, target.value.length);
    			    
    			    // copy the selection
    			    var succeed;
    			    try {
    			    	  succeed = document.execCommand("copy");
    			    } catch(e) {
    			        succeed = false;
    			    }
    			    // restore original focus
    			    if (currentFocus && typeof currentFocus.focus === "function") {
    			        currentFocus.focus();
    			    }
    			    
    			    if (isInput) {
    			        // restore prior selection
    			        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    			    } else {
    			        // clear temporary content
    			        target.textContent = "";
    			    }
    			    return succeed;
    			}
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
    	
    	
    	
    	
       	
       	$scope.subscribeUpdates= function(flag){
     		 $scope.spinner = true;
     		 if(flag =="Yes"){
     			 var data = {"sso":$rootScope.ssoId, "subscribeFlag" : "Yes"}
     		 }
     		 else if(flag =="No"){
     			var data = {"sso":$rootScope.ssoId, "subscribeFlag" : "No"}
     		 }
     		 dashboardService.subscribeUpdates(data).then(function (data) {
   			if(data!=null){
   				if(data.statusFlag=="success"){
	   					$scope.spinner = false;
		   				 if(flag =="Yes"){
		   					$rootScope.notifyStatus ="No";
		   					$scope.successMsgdata = "You have subscribed updates";
		 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
		 	 	        	$scope.serviceSuccess = true;
		 	 	        	$scope.serviceError = false;
		 	 	        	console.log('notifyStatus2', $rootScope.notifyStatus);
		   				 }
		   				 else if(flag =="No"){
		   					$rootScope.notifyStatus ="Yes"; 
		   					$scope.successMsgdata = "You have un subscribed updates";
		 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
		 	 	        	$scope.serviceSuccess = true;
		 	 	        	$scope.serviceError = false;
		 	 	        	console.log('notifyStatus2', $rootScope.notifyStatus);
		   				 }
	   					
	   					
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
		 
		 
		 $scope.toggleFolder = function(id){
			 $('#'+id).next().next().find('li.folderData').toggle('slow')
			 $('#'+id).next().next().find('li.filesData').toggle('slow')
			 
		 }
		 
		 
		 $scope.getSitemapBCdata = function(id){
			 var bdData = [];
			 var temp = $('#'+id).parents();
			 var loop = true;
			 angular.forEach(temp, function(value, key){
				 if(value.id!=""){
					 if(value.id==id ){
						 loop = false;
					 }
					 else if(loop==true){
						 var getFolderText = value.innerText.split('open')[0]
						 var fId = value.id.split('f')[1]
				         var tempData = {"id":fId,"name":getFolderText}
				         bdData.push(tempData);
					 }
				 }
			 });
			var testBCdata = bdData.reverse();
			sessionStorage.setItem("parentData", JSON.stringify(testBCdata));
		 };
		 $scope.openBMwindow = function(id, val, name,desc){
			
			 $scope.editBM =false;
			 if(val==undefined){
				 $scope.bmurl ="http://";
	 			 $scope.bmId = "";
	 			 $scope.bmName = "";
	 			 $scope.bmDesc = "";
			 }
			 else{
			 $scope.bmurl =val;
			 $scope.editBM =true;
			 $scope.bmId = id;
			 $scope.bmName = name;
			 $scope.bmDesc = desc;
			 $('#bmurl').val($scope.bmurl);
			 }
			 var appendthis =  ("<div class='modal-overlay'></div>");
	  			    $("body").append(appendthis);
	  			    $(".modal-overlay").fadeTo(500, 0.7);
	  			    var modalBox = "BMwindow";
	  			    $('#'+modalBox).fadeIn($(this).data());
	  			  
	  			$(".closeBtn, .btnClose, .actionbuttons, .js-modal-close").click(function() {
	  			  $(".modal-box, .modal-overlay").fadeOut(500, function() {
	  			    $(".modal-overlay").remove();
	  			    $('#bmurl').val('');
	  			    $scope.bmurl ="";
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
		 $scope.createOrUpdateBookmark= function(){
    		 $scope.spinner = true;
    		 var folderID =sessionStorage.getItem("folderId");
      			dashboardService.getGTBToken().then(function (data) {
          			if(data!=null){
          				$rootScope.gtbToken = data.accessToken;
         	    			 if($scope.editBM ==false){
         	    				var data = {"url": $scope.bmurl, "parent": {"id": folderID}, "name":$scope.bmName, "description":$scope.bmDesc};
            	    			 dashboardService.createBookmark(data).then(function (response) { 
            	    				$scope.spinner = false;
            	    	    		if(response!=null){
            	    	    			$scope.getFolders();
   	     	   	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
   	     	   	 	 	    		$scope.successMsgdata = "Bookmark Created successfully";
   	     	   	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
   	     	   	 	 	        	$scope.serviceSuccess = true;
   	     	   	 	 	        	$scope.serviceError = false;
            	    	    		}
            	    			 },function(error){
            	    				 $scope.spinner = false
           	   	 	    		 $scope.serviceError = true;
           	   	 	    		 $scope.errorMsgdata = error.message;
           	   	 	    		 $scope.serviceSuccess = false;
           	   	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
            	  	    		});
         	    			 }
         	    			 else if($scope.editBM ==true){
         	    				var data = {"url": $scope.bmurl, "parent": {"id": folderID}, "name":$scope.bmName, "description":$scope.bmDesc};
         	    				dashboardService.updateBookmark($scope.bmId, data).then(function (response) { 
           	    				$scope.spinner = false;
           	    	    		if(response!=null){
           	    	    			$scope.getFolders();
  	     	   	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
  	     	   	 	 	    		$scope.successMsgdata = "Bookmark updated successfully";
  	     	   	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
  	     	   	 	 	        	$scope.serviceSuccess = true;
  	     	   	 	 	        	$scope.serviceError = false;
           	    	    		}
           	    			 },function(error){
           	    				 $scope.spinner = false
          	   	 	    		 $scope.serviceError = true;
          	   	 	    		 $scope.errorMsgdata = error.message;
          	   	 	    		 $scope.serviceSuccess = false;
          	   	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
           	  	    		});
         	    			 }
      	      				}
  	    		},function(error){
 	 	    		 $scope.spinner = false
 	 	    		 $scope.serviceError = true;
 	 	    		 $scope.errorMsgdata = "Failed";
 	 	    		 $scope.serviceSuccess = false;
 	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
  	    		})
     	};
     	
     	
     	$scope.deleteBookmark= function(id){
   		 $scope.spinner = true;
     			dashboardService.getGTBToken().then(function (data) {
         			if(data!=null){
         				$rootScope.gtbToken = data.accessToken;
        	    			 dashboardService.deleteBookmark(id).then(function (response) { 
        	    				$scope.spinner = false;
        	    	    		if(response!=null){
        	    	    			$scope.getFolders();
	     	   	 	 	    		$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
	     	   	 	 	    		$scope.successMsgdata = "Bookmark Deleted";
	     	   	 	 	        	$('#serviceSuccessMsg #alert').removeClass('fade-out hidden');
	     	   	 	 	        	$scope.serviceSuccess = true;
	     	   	 	 	        	$scope.serviceError = false;
        	    	    		}
        	    			 },function(error){
        	    				 $scope.spinner = false
       	   	 	    		 $scope.serviceError = true;
       	   	 	    		 $scope.errorMsgdata = error.message;
       	   	 	    		 $scope.serviceSuccess = false;
       	   	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
        	  	    		});
     	      				}
 	    		},function(error){
	 	    		 $scope.spinner = false
	 	    		 $scope.serviceError = true;
	 	    		 $scope.errorMsgdata = "Failed";
	 	    		 $scope.serviceSuccess = false;
	                 $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	    		})
    	};
    	
    	
     	$scope.openBM = function(value){
     		 window.open(value, '_blank');
     	}
    	 $scope.gotoDashBoard = function(){
    		  $state.go('dashboard');
    	  }
    	  $scope.gotoFileView = function(){
    		  $state.go('filesView');
    	  }
    	
    	  if($state.current.name =="view" ){
    		  $scope.userActions();
    		  $scope.getFolders();
    		  $scope.addFile();
    		  $rootScope.folderID = sessionStorage.getItem("folderId");
    	  }
    	  
    	  if($state.current.name =="dashboard" ){ 
    		  $scope.getCards();  		
    		  sessionStorage.removeItem('parentData');
    	  }
    	  if($state.current.name =="sitemap"){
    		  if($scope.treeData.length!="0"){
    			  angular.element(document.body).scope().$apply();
    		  }
    	  }
    	  
    	 /* 
    	 if(!$rootScope.showWArng){
    		 $scope.spinner = false;
    		 var appendthis =  ("<div class='modal-overlay'></div>");
 		    $("body").append(appendthis);
 		    $(".modal-overlay").fadeTo(500, 0.7);
 		    var modalBox = "onPopup";
 		    $('#'+modalBox).fadeIn($(this).data()); 
    	 } 
		$(".closePopup").click(function() {
			$rootScope.showWArng = true;  
		  $(".modal-box, .modal-overlay").fadeOut(500, function() {
		    $(".modal-overlay").remove();
		  });
		}); */   	  
    }]);
});
