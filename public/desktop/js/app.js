(function (ng) {
    'use strict';

    ng.module('adluxe', [ 'adluxe.demos.fireworks', 'ngRoute' ])
        .config([ '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/fireworks', {
                    templateUrl: 'views/fireworks.html',
                    controller: 'adluxe.demos.fireworks.FireworksCtrl'
                })
                .when('/', {
                    templateUrl: 'views/index.html'
                })
                .otherwise({ redirectTo: '/' });
        } ]);
} (angular));