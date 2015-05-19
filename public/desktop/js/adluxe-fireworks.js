(function (ng) {
	'use strict';

	ng.module('adluxe.demos.fireworks', [ 'adluxe.core' ])
		.directive('adluxeAircraft', [ '$rootScope', '$window', 'adluxe.core.Utils', function ($rootScope, $window, utils) {
			return {
				restrict: 'A',
				scope: { },
				link: function (scope, iElement) {
					var aircraft, shadow, land, texture, explosions, emitter, pendingExplode = false;
					var fixRotation = Math.PI * 3 / 2;

					var game = new Phaser.Game(600, 600, Phaser.CANVAS, iElement[0], {
						preload: function () {
							game.load.image('aircraft', '/assets/aircraft.png');
							game.load.image('aircraft-shadow', '/assets/aircraft_shadow.png');
							game.load.image('earth', '/assets/scorched_earth.png');
							game.load.image('smoke', '/assets/smoke-puff.png');
							game.load.spritesheet('kaboom', '/assets/explosion.png', 64, 64, 23);
						},
						create: function () {
							game.physics.startSystem(Phaser.Physics.ARCADE);
							game.stage.backgroundColor = '#000000';

							land = game.add.tileSprite(0, 0, 600, 600, 'earth');
							land.fixedToCamera = true;

							explosions = game.add.group();

							for (var i = 0; i < 10; i++) {
								var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
								explosionAnimation.anchor.setTo(0.5, 0.5);
								explosionAnimation.animations.add('kaboom');
							}

							texture = game.add.renderTexture(600, 600);
							game.add.sprite(0, 0, texture);

							shadow = game.add.sprite(300, 300, 'aircraft-shadow');
							shadow.anchor.setTo(0.5, 0.5);

							aircraft = game.add.sprite(300, 300, 'aircraft');
							aircraft.anchor.setTo(0.5, 0.5);

							game.physics.enable(aircraft, Phaser.Physics.ARCADE);
							game.physics.arcade.enableBody(aircraft);

							aircraft.body.allowRotation = false;

							emitter = game.add.emitter(aircraft.position.x, aircraft.position.y);
							emitter.makeParticles([ 'smoke' ]);
							emitter.gravity = 0;
							emitter.setAlpha(1, 0, 300);
							emitter.setScale(0.4, 0.8, 0.4, 0.8, 3000);
							emitter.start(false, 600, 5);

							aircraft.bringToTop();
						},
						update: function () {
							var px = -aircraft.body.velocity.x;
							var py = -aircraft.body.velocity.y;

							emitter.minParticleSpeed.set(px * 0.25, py * 0.25);
							emitter.maxParticleSpeed.set(px * 1.25, py * 1.25);

							emitter.emitX = aircraft.x;
							emitter.emitY = aircraft.y;

							aircraft.rotation = game.physics.arcade.moveToXY(aircraft, current.x, current.y, 25, 500) - fixRotation;

							shadow.x = aircraft.x;
							shadow.y = aircraft.y;
							shadow.rotation = aircraft.rotation;

							if (pendingExplode) {
								var explosionAnimation = explosions.getFirstExists(false);

								if (explosionAnimation !== null) {
									explosionAnimation.reset(aircraft.position.x, aircraft.position.y);
									explosionAnimation.play('kaboom', 30, false, true);
								}

								pendingExplode = false;
							}
						},
						destroy: function () {
							console.log('destroy');
						}
					});

					var unregisterExplodeHandler = $rootScope.$on('action:explode', function (event, data) {
						if (!pendingExplode) {
							pendingExplode = true;
						}
					});

					var origin = { x: 300, y: 300 };
					var last = { x: origin.x, y: origin.y };
					var current = { x: 0, y: 0 };

					var xMultiplier = 5;
					var zMultiplier = 5;

                    var ax, ay, vx = 0, vy = 0, x = 0, y = 0;

                    var unregisterStrokeHandler = $rootScope.$on('action:stroke', function (event, data) {
                        ax = data.accelerationIncludingGravity.x * xMultiplier;
                        ay = data.accelerationIncludingGravity.y * zMultiplier;

                        vx = vx + ax;
                        vy = vy - ay;

                        vx = vx * 0.98;
                        vy = vy * 0.98;

                        x = parseInt(x + (vx / 20));
                        y = parseInt(y + (vy / 20));

                        /* Check bounds */
                        if (x < 0) {
                            x = 0;
                            vx = -vx;
                        }

                        if (y < 0) {
                            y = 0;
                            vy = -vy;
                        }

                        if (x > 600) {
                            x = 600;
                            vx = -vx;
                        }

                        if (y > 600) {
                            y = 600;
                            vy = -vy;
                        }

                        current.x = x;
                        current.y = y;
                    });

					scope.$on('$destroy', function () {
						console.log('>>> Cleanup');
						unregisterStrokeHandler();
						unregisterExplodeHandler();

						game.destroy();
						game = null;
						
						iElement.empty();
					});
				}
			};
		} ])

        .directive('adluxeStrokes', [ '$rootScope', '$window', 'adluxe.core.Utils', 'adluxe.demos.fireworks.Particle', function ($rootScope, $window, utils, Particle) {
            return {
                restrict: 'A',
                scope: { },
                link: function (scope, iElement) {
                    var canvas = iElement[0];
                    var context = canvas.getContext('2d');
                    var particles = [ ];

                    var createStroke = function (from, to) {
                        var distance = Math.floor(vec2.distance(to, from));

                        var pointCount = Math.floor(distance / 20);

                        var drawStep = function (vector, alpha) {
                            var particle = new Particle();

                            particle.x = vector[0] + utils.randomInt(-10, 10);
                            particle.y = vector[1] + utils.randomInt(-10, 10);

                            particle.radius = utils.randomInt(10, 30);

                            particle.color = 'rgba(255, 0, 0, ' + alpha + ')';

                            particle.scaleSpeed = utils.randomFloat(1.0, 4.0);

                            particle.velocityX = 0;
                            particle.velocityY = 0;

                            particles.push(particle);
                        };

                        var step = 1 / pointCount;
                        var t    = 0.0;

                        while (t <= 1) {
                            drawStep(vec2.lerp(vec2.create(), from, to, t), t);
                            t += step;
                        }
                    };

                    /*var update = function () {
                        context.fillStyle = 'rgba(255, 255, 255, 0.05)';
                        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

                        $window.requestAnimationFrame(update, canvas);
                    };*/

                    var update = function () {
                        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

                        particles = particles.filter(function (particle) {
                            return particle.scale > 0;
                        });

                        particles.forEach(function (particle) {
                            particle.update(1000.0 / 60.0);
                            particle.draw(context);
                        });

                        $window.requestAnimationFrame(update, canvas);
                    };

                    update();

                    var origin = vec2.fromValues(
                        Math.floor(context.canvas.width  * 0.5),
                        Math.floor(context.canvas.height * 0.5)
                    );

                    var last = vec2.clone(origin);

                    var current = vec2.create();

                    var xMultiplier = -40; // invert x-axis (?)
                    var zMultiplier =  40;

                    var unregisterHandler = $rootScope.$on('action:stroke', function (event, data) {
                        var addX = data.acceleration.x,
                            addZ = data.acceleration.z;

                        /*if (Math.abs(addX / addZ) > 2) {
                            addZ = 0;
                        }

                        if (Math.abs(addZ / addX) > 2) {
                            addX = 0;
                        }*/

                        addX *= xMultiplier;
                        addZ *= zMultiplier;

                        vec2.add(current, origin, vec2.fromValues(addX, addZ));

                        if (current[0] < 0) current[0] = 0;
                        if (current[0] > context.canvas.width) current[0] = context.canvas.width;

                        if (current[1] < 0) current[1] = 0;
                        if (current[1] > context.canvas.height) current[1] = context.canvas.height;

                        createStroke(last, current);

                        //drawPosition(current);

                        vec2.copy(last, current);
                    });

					scope.$on('$destroy', function () {
						unregisterHandler();
					});
                }
            };
        } ])
        .directive('adluxeFireworks', [ '$rootScope', '$window', 'adluxe.core.Utils', 'adluxe.demos.fireworks.Particle', function ($rootScope, $window, utils, Particle) {
			return {
				restrict: 'A',
				scope: { },
				link: function (scope, iElement) {
					var canvas = iElement[0];
					var context = canvas.getContext('2d');

					var particles = [ ];

					var createExplosion = function (x, y, color) {
						var minSize = 10;
						var maxSize = 30;
						var count = 10;
						var minSpeed = 60.0;
						var maxSpeed = 200.0;
						var minScaleSpeed = 1.0;
						var maxScaleSpeed = 4.0;

						for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
							var particle = new Particle();

							particle.x = x;
							particle.y = y;

							particle.radius = utils.randomInt(minSize, maxSize);

							particle.color = color;

							particle.scaleSpeed = utils.randomFloat(minScaleSpeed, maxScaleSpeed);

							var speed = utils.randomFloat(minSpeed, maxSpeed);

							particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
							particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

							particles.push(particle);
						}
					};

					var update = function () {
						context.clearRect(0, 0, context.canvas.width, context.canvas.height);

						particles = particles.filter(function (particle) {
							return particle.scale > 0;
						});

						particles.forEach(function (particle) {
							particle.update(1000.0 / 60.0);
							particle.draw(context);
						});

                        $window.requestAnimationFrame(update, canvas);
					};

                    update();

					var unregisterHandler = $rootScope.$on('action:explode', function () {
						var x = utils.randomFloat(0, canvas.width),
							y = utils.randomFloat(0, canvas.height);

						createExplosion(x, y, '#525252');
						createExplosion(x, y, '#FFA318');
					});

					scope.$on('$destroy', function () {
						unregisterHandler();
					});
				}
			};
		} ])
		.factory('adluxe.demos.fireworks.Particle', function () {
			function Particle () {
				this.scale = 1.0;
				this.x = 0;
				this.y = 0;
				this.radius = 20;
				this.color = "#000";
				this.velocityX = 0;
				this.velocityY = 0;
				this.scaleSpeed = 0.5;
			}

			Particle.prototype.update = function (ms) {
				this.scale -= this.scaleSpeed * ms / 1000.0;

				if (this.scale <= 0) {
					this.scale = 0;
				}

				this.x += this.velocityX * ms / 1000.0;
				this.y += this.velocityY * ms / 1000.0;
			};

			Particle.prototype.draw = function(context2D) {
				context2D.save();
				context2D.translate(this.x, this.y);
				context2D.scale(this.scale, this.scale);

				context2D.beginPath();
				context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
				context2D.closePath();

				context2D.fillStyle = this.color;
				context2D.fill();

				context2D.restore();
			};

			return Particle;
		})
		.controller('adluxe.demos.fireworks.FireworksCtrl', [ '$scope', '$rootScope', '$location', 'adluxe.core.SocketFactory', function ($scope, $rootScope, $location, SocketFactory) {
			$scope.desktopConnected = false;
			$scope.deviceConnected = false;
			$scope.deviceUrl = undefined;

            $scope.accelerationX = 0;
            $scope.accelerationZ = 0;

			var socket = SocketFactory.create('/adluxe/fireworks');

			socket.on('connect', function () {
				console.log('Connected');

                socket.on('connection:complete', function (data) {
					console.log('Connection complete', data);

					$scope.desktopConnected = true;

					var deviceUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/mobile/fireworks/#/?uuid=' + data.uuid;

					$scope.deviceUrl = deviceUrl;
				});

				socket.on('device:connectionComplete', function () {
					$scope.deviceConnected = true;
                    $rootScope.connected = true;
				});

				socket.on('device:disconnected', function () {
					console.log('Device was disconnected');
					$scope.deviceConnected = false;
                    $rootScope.connected = false;
				});

				socket.on('device:tap', function () {
					console.log('Device was tapped', new Date());
					$rootScope.$broadcast('action:explode');
				});

				socket.on('device:motion', function (data) {
					console.log('Device was moved', new Date());
                    $rootScope.$broadcast('action:stroke', data);

                    $scope.accelerationX = data.acceleration.x;
                    $scope.accelerationZ = data.acceleration.z;
				});

				socket.emit('desktop:connect');
			});

			$scope.$on('$destroy', function () {
				socket.disconnect();
			});
		} ]);
} (angular));