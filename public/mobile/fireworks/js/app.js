(function (ng) {
    'use strict';

    ng.module('adluxe.demos.fireworks.mobile', [ 'ngTouch', 'adluxe.core' ])
        .controller('adluxe.demos.fireworks.mobile.AppCtrl', [ '$scope', '$window', '$location', 'adluxe.core.SocketFactory', function ($scope, $window, $location, SocketFactory) {
            $scope.connected = false;

            var socket = SocketFactory.create('/adluxe/fireworks');
            var sensitivity = 0.1;

            socket.on('connect', function () {
                socket.on('connection:complete', function (data) {
                    $scope.connected = true;

                    $scope.tap = function () {
                        socket.emit('device:tap');
                    };

                    if ($window.DeviceMotionEvent) {
                        $window.addEventListener('devicemotion', function (event) {
                            if (Math.abs(event.acceleration.x) < sensitivity && Math.abs(event.acceleration.z) < sensitivity) {
                                return;
                            }

                            socket.emit('device:motion', {
                                acceleration: event.acceleration,
                                accelerationIncludingGravity: event.accelerationIncludingGravity,
                                rotationRate: event.rotationRate,
                                interval: event.interval
                            });
                        });
                    }
                });

                socket.on('desktop:disconnect', function () {
                    $scope.connected = false;
                });

                socket.emit('device:connect', { pin: '1234', uuid: $location.search().uuid });
            });
        } ]);
} (angular));