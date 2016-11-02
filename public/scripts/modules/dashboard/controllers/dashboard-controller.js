define(['angular', '../dashboard'], function (angular, controllers) {
    'use strict';
    // Controller definition
    controllers.controller('dashboard-controller', ['$scope', '$state', '$log', '$rootScope', 'PredixAssetService', '$http', '$timeout', '$compile', '$location', '$anchorScroll', 'dashboardService','$q', '$urlRouter','fileUpload', function ($scope, $state, $log, $rootScope, PredixAssetService, $http, $timeout, $compile, $location, $anchorScroll,dashboardService, $q, $urlRouter, fileUpload) {
       	    //$rootScope.ssoId = "502450548";
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
    	 $scope.getSubFolders = function(dataId){
    	    	$scope.spinner = true;
    	    	$scope.cardsData = false;
    	    	$scope.subfolderData = false;
    	    	dashboardService.getSubFoldersFilesDetails(dataId).then(function(response) {
    	    		$scope.cardContent = true;
    	    		$scope.filesContent = true;
    	    		$rootScope.subFoldersFilesData = response.data;
    	    		$rootScope.allfoldersData = [];
    	    		$rootScope.parentID = dataId;
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
                	$scope.serviceError = true;
                    $scope.errorMsgdata = "Failed to load data";
                    $('#serviceErroMsg #alert').removeClass('fade-out hidden');
                });
    	   		
    	    	
    	 }
    
    	 
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
 	    			 $rootScope.parentCards = response.folderList;
 	    			 $scope.getRandomColor();
 	    			$scope.getFolderData();
 	    			 
 	    			
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
 	        
    	 }
    	 
    	 $scope.getFolderData = function(){
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
       	            }, {
       	              "name": "C",
       	              "identifier": "001-1c"
       	            }, {
       	              "name": "D",
       	              "identifier": "001-1d"
       	            }, {
       	              "name": "E",
       	              "identifier": "001-1e"
       	            }, {
       	              "name": "F",
       	              "identifier": "001-1f"
       	            }, {
       	              "name": "G",
       	              "identifier": "001-1g"
       	            }, {
       	              "name": "H",
       	              "identifier": "001-1h"
       	            }, {
       	              "name": "I",
       	              "identifier": "001-1i"
       	            }, {
       	              "name": "AA",
       	              "identifier": "001-1a"
       	            }, {
       	              "name": "BB",
       	              "identifier": "001-1b"
       	            }, {
       	              "name": "CC",
       	              "identifier": "001-1c"
       	            }, {
       	              "name": "DD",
       	              "identifier": "001-1d"
       	            }, {
       	              "name": "EE",
       	              "identifier": "001-1e"
       	            }, {
       	              "name": "FF",
       	              "identifier": "001-1f"
       	            }, {
       	              "name": "GG",
       	              "identifier": "001-1g"
       	            }, {
       	              "name": "HH",
       	              "identifier": "001-1h"
       	            }, {
       	              "name": "II",
       	              "identifier": "001-1i"
       	            }, {
       	              "name": "AAA",
       	              "identifier": "001-1a"
       	            }, {
       	              "name": "BBB",
       	              "identifier": "001-1b"
       	            }, {
       	              "name": "CCC",
       	              "identifier": "001-1c"
       	            }, {
       	              "name": "DDD",
       	              "identifier": "001-1d"
       	            }, {
       	              "name": "EEE",
       	              "identifier": "001-1e"
       	            }, {
       	              "name": "FFF",
       	              "identifier": "001-1f"
       	            }, {
       	              "name": "GGG",
       	              "identifier": "001-1g"
       	            }, {
       	              "name": "HHH",
       	              "identifier": "001-1h"
       	            }, {
       	              "name": "III",
       	              "identifier": "001-1i"
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
    	 $scope.getFolders = function(dataId, folderName){
    		 $scope.spinner = true;
    		 $scope.folderView =true;
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
 	    			$rootScope.	commentsData = response.commentsList;
 	    			 $rootScope.parentID =dataId;
 	    			for(var i=0; i<$rootScope.allFilesData.length; i++){
 	    				$rootScope.allFilesData[i].actions="";
 	    				$rootScope.allFilesData[i].actions = '<button style="background: none;border: none" value="'+$rootScope.allFilesData[i].fileID+'"  class="actionBtn flex flex--center flex--middle style-scope aha-table"><i class="fa fa-bars" aria-hidden="true"></i></button>';
 	    				//var val=$('button.actionBtn').attr("value").split(',');
 	    			};
 	    			 console.log(response);
 	    			 $state.go('view');
 	    			 $scope.errrorMsg== true;
 	    		/*	 
 	    			for (var key in response) {
 	    				  if (response.hasOwnProperty("folderList") ==false && response.hasOwnProperty("fileList") ==false) {
 	    					 $scope.folderView =true;
 	 	    				 $scope.errrorMsg= true;
 	    				  }
 	    				}*/
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
 	        
    	 }
    	 
    	 
    	 $scope.getAkanaToken = function(){
     		dashboardService.getAkanaToken().then(function (response) {
 	    		 if(response!=null){
 	    			$rootScope.akanaToken = response.access_token;
 	    			 $scope.getGTBToken();
 	 	    		 console.log('akana_token', response);
 	    			 
 	    		 }
 	    	},function(error){
 	        	$scope.errorMsgdata = "Failed";
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
 	           	$scope.errorMsgdata = "Failed";
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
 	        	$scope.errorMsgdata = true;
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
    	 $scope.fileupload = function(file,filetype){
    		$scope.spinner = true;
    		var folderDataId = sessionStorage.getItem("folderId");
    		var data = {"name":$rootScope.filename, "parent":{"id": folderDataId},"file":"data:"+filetype+";"+file}
    		//var formData = new FormData($('#files')[0])
     		dashboardService.fileUpload(data).then(function (response) {
     			 $scope.spinner = false;
     			 if(response!=""){
     				$rootScope.fileuploadData = response;
     				$(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove()});
     				$rootScope.filename="";
     			 }
     			 
 	    		 
 	    	},function(error){
 	    		 $scope.spinner = false
 	        	$scope.errorMsgdata = "Upload Failed";
 	    		$scope.serviceError = true;
 	    		$scope.serviceSuccess = false;
                $('#serviceErroMsg #alert').removeClass('fade-out hidden');
 	        })
    	 };
    	 
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
    	 $scope.craeteFolderToBox = function(flag){
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
    	 };
    	 
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
				$scope.getFolders();
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
    	 
    	 
    	 $scope.getAkanaToken();
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
    		  
    	  }
    	  if($state.current.name =="dashboard" ){ 
    		  $scope.getCards();
    		 
    	  }
    }]);
});
