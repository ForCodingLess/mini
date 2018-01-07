webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var handler = null;

function invite(openid) {
	handler.send({
		from: {
			openid: handler.openid,
			nickname: handler.nickname,
			headimg: handler.headimg
		},
		to: {
			openid: openid
		}
	}, 'invite');
}

function promise(dom) {
	var openid = dom.getAttribute('data-id');
	handler.send({
		openid1: openid,
		openid2: handler.openid
	}, 'promise');
}

(function () {
	var WSSocket = function () {
		function WSSocket(obj) {
			var _this = this;

			_classCallCheck(this, WSSocket);

			this.handler = new WebSocket(config.WSS);

			this.id = obj.id;
			this.openid = obj.openid;
			this.headimg = obj.headimg;
			this.nickname = obj.nickname;

			this.handler.onopen = function () {
				console.log("连接已打开");
				_this.send(null, 'login');
			};

			this.handler.onclose = function () {
				_this.handler = null;
			};

			this.handler.onmessage = function (res) {
				obj.onMessage(res);
			};
		}

		_createClass(WSSocket, [{
			key: 'send',
			value: function send(data) {
				var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'operate';

				if (this.handler) {
					switch (type) {
						case 'operate':
							this.handler.send(JSON.stringify({
								id: this.id,
								type: type,
								pos: data,
								openid: this.openid
							}));
							break;
						default:
							this.handler.send(JSON.stringify({
								id: this.id,
								type: type,
								pos: data,
								openid: this.openid,
								headimg: this.headimg,
								nickname: this.nickname
							}));
							break;
					}
				}
			}
		}]);

		return WSSocket;
	}();

	var Tree = function (_Phaser$Sprite) {
		_inherits(Tree, _Phaser$Sprite);

		function Tree(game, x, y) {
			var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 40;
			var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 40;

			_classCallCheck(this, Tree);

			var key = game.rnd.between(1, 4);

			var _this2 = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, game, x, y, key));

			_this2.width = width;
			_this2.height = height;
			_this2.inputEnabled = false;
			game.physics.arcade.enable(_this2);
			_this2.body.collideWorldBounds = true;
			_this2.body.immovable = true;
			return _this2;
		}

		return Tree;
	}(Phaser.Sprite);

	var Player = function (_Phaser$Sprite2) {
		_inherits(Player, _Phaser$Sprite2);

		function Player(game, x, y, key) {
			var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 25;
			var height = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 25;

			_classCallCheck(this, Player);

			var _this3 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, game, x, y, key));

			_this3.width = width;
			_this3.height = height;
			game.physics.arcade.enable(_this3);
			_this3.smoothed = true;
			_this3.body.collideWorldBounds = true;
			game.world.add(_this3);
			return _this3;
		}

		return Player;
	}(Phaser.Sprite);

	var Control = function (_Phaser$Button) {
		_inherits(Control, _Phaser$Button);

		function Control(game, x, y, key1, key2) {
			var width1 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 90;
			var height1 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 90;
			var width2 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 110;
			var height2 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 110;

			_classCallCheck(this, Control);

			var _this4 = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this, game, x, y, key1));

			_this4.width = width1;
			_this4.anchor.setTo(0.5, 0.5);
			_this4.fixedToCamera = true;
			_this4.height = height1;
			_this4.smoothed = true;
			_this4.visible = true;
			game.world.add(_this4);

			_this4.child = new Phaser.Button(game, 0, 0, key2);
			_this4.child.width = width2;
			_this4.child.height = height2;
			_this4.child.anchor.setTo(0.5, 0.5);
			_this4.child.smoothed = true;
			_this4.child.visible = true;
			_this4.addChild(_this4.child);
			return _this4;
		}

		_createClass(Control, [{
			key: 'move',
			value: function move(x, y) {
				var _x = this.worldPosition.x;
				var _y = this.worldPosition.y;
				var _ang = Phaser.Math.angleBetweenY(_x, _y, x, y);
				var _desX = this.child.width * Math.sin(_ang);
				var _desY = this.child.width * Math.cos(_ang);
				this.child.position.x = _desX;
				this.child.position.y = _desY;
			}
		}, {
			key: 'tap',
			value: function tap(x, y) {
				this.fixedToCamera = false;
				this.position.x = x;
				this.position.y = y;
				this.child.position.x = 0;
				this.child.position.y = 0;
				this.child.visible = true;
				this.fixedToCamera = true;
			}
		}, {
			key: 'cancel',
			value: function cancel() {
				this.child.visible = false;
			}
		}]);

		return Control;
	}(Phaser.Button);

	var maze = [];
	var data1 = {},
	    data2 = {};
	var player1;
	var player2;
	var game;
	var dialog;

	var MazeGame = function (_Phaser$Game) {
		_inherits(MazeGame, _Phaser$Game);

		function MazeGame(openid, headimg) {
			var nickname = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '所谓伊人';

			_classCallCheck(this, MazeGame);

			// this.game=new Phaser.Game("100","100",Phaser.CANVAS,'container');
			var _this5 = _possibleConstructorReturn(this, (MazeGame.__proto__ || Object.getPrototypeOf(MazeGame)).call(this, "100", "100", Phaser.CANVAS, 'container'));

			_this5.state.add('preload', _this5.preload);
			_this5.state.add('create', _this5.create);
			_this5.state.add('play', _this5.play);
			_this5.state.add('over', _this5.over);

			_this5.state.start('preload');
			return _this5;
		}

		_createClass(MazeGame, [{
			key: 'preload',
			value: function preload() {
				var _this6 = this;

				this.preload = function () {
					_this6.load.crossOrigin = 'anonymous';
					_this6.stage.backgroundColor = "#ffffff";

					_this6.load.image('1', './img/tree1.png');
					_this6.load.image('2', './img/tree2.png');
					_this6.load.image('3', './img/tree3.png');
					_this6.load.image('4', './img/flower.png');

					_this6.load.image('c1', './img/c1.png');
					_this6.load.image('c2', './img/c2.png');

					_this6.load.image('p1', data1.img);
					_this6.load.image('p2', data2.img);
				}, this.create = function () {
					_this6.state.start('create');
				};
			}
		}, {
			key: 'create',
			value: function create() {
				var _this7 = this;

				this.create = function () {
					_this7.world.setBounds(0, 0, 1640, 1230);
					_this7.physics.startSystem(Phaser.Physics.ARCADE);
					_this7.state.start('play');
				};
			}
		}, {
			key: 'play',
			value: function play() {
				var _this8 = this;

				var trees;
				var timer;
				var controller;
				this.create = function () {
					trees = _this8.add.group();
					trees.ignoreChildInput = true;
					for (var p in maze) {
						for (var q in maze[p]) {
							if (maze[p][q] === 0) {
								trees.add(new Tree(_this8, p * 40, q * 40));
							}
						}
					}

					player1 = new Player(_this8, data1.x * 40 + 7, data1.y * 40 + 7, 'p1');
					player2 = new Player(_this8, data2.x * 40 + 7, data2.y * 40 + 7, 'p2');

					var position = {};
					var touch = false;
					controller = new Control(_this8, 60, 60, 'c1', 'c2');

					_this8.camera.follow(player1);
					_this8.input.maxPointers = 1;
					_this8.input.onDown.add(function (pointer, e) {
						touch = true;
						Object.assign(position, { x: pointer.clientX, y: pointer.clientY });
						controller.tap(pointer.clientX, pointer.clientY);
					});
					_this8.input.onUp.add(function (pointer, e) {
						touch = false;
						position = {};
						player1.body.velocity.x = 0;
						player1.body.velocity.y = 0;
						controller.cancel();
					});
					_this8.input.addMoveCallback(function (pointer, x, y, isTap) {
						if (!isTap && touch) {
							var _x = x - position.x;
							var _y = y - position.y;
							if (Math.abs(_x) > Math.abs(_y)) {
								if (x > position.x) {
									player1.body.velocity.x = 250;
								} else {
									player1.body.velocity.x = -250;
								}
							} else {
								if (y > position.y) {
									player1.body.velocity.y = 250;
								} else {
									player1.body.velocity.y = -250;
								}
							}
							controller.move(x, y);
						}
					}, _this8.input.pointer1);

					timer = setInterval(function () {
						if (touch) {
							handler.send({
								x: _this8.world.width - player1.position.x - player1.width,
								y: _this8.world.height - player1.position.y - player1.height
							});
						}
					}, 100);
				}, this.update = function () {
					_this8.physics.arcade.collide(player1, trees);
					_this8.physics.arcade.overlap(player1, player2, function () {
						clearInterval(timer);
						handler.send({});
						this.state.start('over', true, false);
					}, null, _this8);
				};
			}
		}, {
			key: 'render',
			value: function render(x, y) {
				this.add.tween(player2).to({ x: x, y: y }, 50, Phaser.Easing.Linear.None, true, 0, 0);
			}
		}, {
			key: 'over',
			value: function over() {
				this.create = function () {};
			}
		}, {
			key: 'receive',
			value: function receive(res) {
				var obj = JSON.parse(res.data);
				var _type = obj.code;
				switch (_type) {
					case 0:
						this.render(obj.operation.pos.x, obj.operation.pos.y);
						break;
					case 520:
						timer && clearInterval(timer);
						this.state.start('over');
						break;
					default:
						break;
				}
			}
		}]);

		return MazeGame;
	}(Phaser.Game);

	$(function () {
		var openid = $.fn.cookie('openid');
		var headimg = $.fn.cookie('headimg');
		var nickname = decodeURIComponent($.fn.cookie('name'));
		if (!!openid && !!headimg && !!nickname) {
			openid += ~~(Math.random() * 10000);
			handler = new WSSocket({
				openid: openid,
				headimg: headimg,
				nickname: nickname,
				onMessage: function onMessage(res) {
					var obj = JSON.parse(res.data);
					var _type = obj.code;
					switch (_type) {
						case 200:
							$("#list").css("display", "none");
							$("#container").css("display", "block");
							maze = obj.maze;
							data1 = obj.location;
							data2 = obj.other;
							game = new MazeGame(openid, headimg, nickname);
							break;
						case 0:
							game.receive(res);
							break;
						case 520:
							game.receive(res);
							break;
						case -1:
							$('#' + obj.openid).remove();
							break;
						case 1:
							var str = "";
							var _iteratorNormalCompletion = true;
							var _didIteratorError = false;
							var _iteratorError = undefined;

							try {
								for (var _iterator = obj.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									var user = _step.value;

									str += '<div class=\'userlist\' id=\'' + user.openid + '\'>\n      \t\t\t\t\t\t\t\t\t<div class=\'avatar\' style=\'background-image:url("' + user.headimg + '")\'>\n      \t\t\t\t\t\t\t\t\t</div>\n      \t\t\t\t\t\t\t\t\t<div class=\'nickname\'>\n      \t\t\t\t\t\t\t\t\t\t' + user.nickname + '\n      \t\t\t\t\t\t\t\t\t</div>';
									if (user.status === 1) {
										str += '<div class=\'invitebt\'>\n\t\t\t\t\t\t\t\t\t\t\t<button onclick=\'invite("' + user.openid + '")\'>\u9080\u8BF7</button>\n      \t\t\t\t\t\t\t\t\t\t</div>';
									} else {
										str += '<div class=\'invitebt\'>\n      \t\t\t\t\t\t\t\t\t\t</div>';
									}
								}
							} catch (err) {
								_didIteratorError = true;
								_iteratorError = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return();
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError;
									}
								}
							}

							$("#list").append(str);
							break;
						case 201:
							var openid = obj.openid;
							$(openid + ' .invitebt').html("");
							break;
						case 202:
							var openid = obj.openid;
							$(openid + ' .invitebt').html('<button onclick=\'invite("' + openid + '")\'>\u9080\u8BF7</button>');
							break;
						case 403:
							alert(obj.msg);
							break;
						case 301:
							$("#promise").attr("data-id", obj.user.openid);
							$("#avatar").css("background-image", 'url(\'' + obj.user.headimg + '\')');
							$("#nickname").text(obj.user.nickname);
							$("#iosDialog1").fadeIn(100, function () {
								setTimeout(function () {
									$("#iosDialog1").fadeOut();
								}, 8000);
							});
							break;
						case 302:
							var id = obj.id;
							handler.id = id;
							handler.send(null, 'join');
							break;
					}
				}
			});

			window.addEventListener('resize', function () {
				setTimeout(function () {
					game.game.scale.setGameSize(window.innerWidth, window.innerHeight);
				}, 100);
			}, false);

			document.getElementById('promise').addEventListener('click', function () {
				promise(this);
			});
		} else {
			window.location.href = config.IFRAME;
		}
	});
})();

/***/ })
],[0]);