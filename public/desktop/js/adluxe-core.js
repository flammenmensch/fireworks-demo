(function (ng, io) {
	'use strict';

	ng.module('adluxe.core', [ ])
		.directive('adluxeQr', function () {
			return {
				restrict: 'A',
				scope: {
					data: '='
				},
				link: function (scope, element) {
					scope.$watch('data', function (value) {
						if (ng.isDefined(value) && value !== '') {
							console.log('DATA IS:', value);
							element.attr('src', './api/qr?data=' + encodeURIComponent(value));
						}
					});
				}
			};
		})
        .directive('adluxeConnection', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    connected: '@'
                },
                template: '<i class="glyphicon glyphicon-transfer connection-status" ng-class="{ connected: connected == \'true\' }"></i>'
            };
        })
		.factory('adluxe.core.ImageLoader', [ '$q', function ($q) {
			function ImageLoader() {

			}

			ImageLoader.prototype = {
				load: function (path) {
					var deferred = $q.defer();

					var image = new Image();
					image.src = path;
					image.onload = function () {
						deferred.resolve(image);
					};

					return deferred.promise;
				},

				loadMultiple: function (paths) {
					var deferred = $q.defer();

					var queue = paths.map((function (path) {
						return this.load(path);
					}).bind(this));

					$q.all(queue).then(function (results) {
						deferred.resolve(results);
					});

					return deferred.promise;
				}
			};

			return new ImageLoader();
		} ])
        .factory('adluxe.core.Utils', function () {
            return {
                randomFloat: function (min, max) {
                    return min + Math.random() * (max - min);
                },

                randomInt: function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            };
        })
		.factory('adluxe.core.SocketFactory', [ '$rootScope', function ($scope) {
			function Socket(endpoint) {
				this.__socket = io.connect(endpoint, { 'force new connection': true });
			}

			Socket.prototype = {
				on: function (event, callback) {
					var self = this;

					self.__socket.on(event, function () {
						var args = arguments;

						$scope.$apply(function () {
							callback.apply(self.__socket, args);
						});
					});
				},
				emit: function (event, data, callback) {
					var self = this;

					self.__socket.emit(event, data, function () {
						var args = arguments;

						$scope.$apply(function () {
							callback.apply(self.__socket, args);
						});
					});
				},
				disconnect: function () {
					this.__socket.disconnect();
				}
			};
			return {
				create: function (endpoint) {
					return new Socket(endpoint || './');
				}
			};
		} ]);
} (angular, io));