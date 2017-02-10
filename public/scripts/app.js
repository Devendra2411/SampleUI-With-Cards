/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'interceptors',
    'px-datasource',
    'ng-bind-polymer'
], function ($, angular) {
    'use strict';

    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'app.routes',
        'app.interceptors',
        'sample.module',
        'predix.datasource',
        'px.ngBindPolymer',
		'dashboard'
    ]);

    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$scope', '$rootScope', 'PredixUserService','dashboardService','$state', function ($scope, $rootScope, predixUserService, dashboardService, $state) {

        //Global application object
        window.App = $rootScope.App = {
            version: '1.0',
            name: 'Predix Seed',
            session: {},
            tabs: [
                {icon: 'fa-tachometer', state: 'dashboard', label: 'Dashboard'},
                /*{icon: 'fa-file-o', state: 'blankpage', label: 'Blank Page', subitems: [
                    {state: 'blanksubpage', label: 'Blank Sub Page'}
                ]}*/
            ]
        };

        $rootScope.authorizeUser = function(sso){
			window.isAuthorized="No";
			var data = {"sso":sso}
			if(sso!=""){
				console.log("user sso", sso);
				dashboardService.authorizeUser(data).then(function (response) {
					if(response.validUser=="Yes"){
						$rootScope.roleId =response.roleID;
						$rootScope.notifyStatus =response.notify;
						window.isAuthorized="Yes";
						console.log(response)
					}
					else{
						$rootScope.roleId ="2";
						//window.isAuthorized="No";
						//console.log("Unauthorized user");
						//document.querySelector('px-app-nav').markSelected('/logout');
						//$state.go('logout');
					}
				});
			}
        }
        
        
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'UNAUTHORIZED':
                        //redirect
                        predixUserService.login(toState);
                        break;
                    default:
                        //go to other error state
                }
            }
            else {
                // unexpected error
            }
        });
    }]);


    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});
