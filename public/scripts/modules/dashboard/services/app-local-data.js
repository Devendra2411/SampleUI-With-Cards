define(['angular', '../dashboard'], function(angular, localDataStore) {
    'use strict';

    /*
     *  Store the user selected data and data access over different controllers ..
     */
    localDataStore.value('version', '0.1');

    localDataStore.factory('localDataStore', ['$q', '$rootScope','$http','remoteServiceManager', function($q, $rootScope, $http,remoteServiceManager) {

        var getSSODetails = function(){
        	
        	//commment below line when pushing to cloud
        	$rootScope.userObject = {"sso": "502450548","user_pref_id": 0,"validUser": "Yes","roleID": "1","accessrole": "Admin(All Models)"};
        	userObj.sso = $rootScope.userObject.sso;
        	userObj.accessrole = $rootScope.userObject.accessrole;
        	userObj.isAdmin = $rootScope.userObject.roleID == "1" ? true : false;
        	//userObj.isAdmin
        	return userObj;
        }
         return{
        	 getSSODetails:getSSODetails
        }
    }]);

    return localDataStore;
});
