/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService','$rootScope', function ($q, predixUserService, $rootScope) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                        	deferred.resolve(userInfo);
                        	console.log(userInfo);
                        	$rootScope.ssoId=userInfo.user_name;
                        	console.log('$rootScope.ssoId', $rootScope.ssoId);
                        	$rootScope.emailId=userInfo.email;
                        	$rootScope.notifyStatus = userInfo.notify;
                             $rootScope.authorizeUser($rootScope.ssoId);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })
            .state('dashboard', {
                parent: 'secure',
                url: '/dashboard',
                templateUrl: 'views/dashboards.html',
                controller: 'dashboard-controller'
            })
            .state('view', {
                parent: 'secure',
                url: '/view',
                templateUrl: 'views/view.html',
                controller: 'dashboard-controller'
            })
            .state('filesView', {
                parent: 'secure',
                url: '/files',
                templateUrl: 'views/filesView.html',
                controller: 'dashboard-controller'
            })
             .state('sitemap', {
                parent: 'secure',
                url: '/sitemap',
                templateUrl: 'views/sitemap.html',
                controller: 'dashboard-controller'
            })
            .state('blankpage', {
            	parent: 'secure',
                url: '/blankpage',
                templateUrl: 'views/blank-page.html'
            })
            .state('blanksubpage', {
            	parent: 'secure',
                url: '/blanksubpage',
                templateUrl: 'views/blank-sub-page.html'
            })
            .state('logout', {
                parent: 'secure',
                url: '/logout',
                templateUrl: 'views/logout.html'
            });


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            document.querySelector('px-app-nav').markSelected('/dashboard');
            $state.go('dashboard');
        });

    }]);
});
