webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	var MazeGame = {
		init: function init() {
			this.game = new Phaser.Game(345, 667, Phaser.Auto, 'container');
			this.game.state.add('preload', this.preload);
			this.game.state.add('create', this.create);
			this.game.state.add('update', this.update);
			this.game.state.add('render', this.render);
			this.game.state.start('preload');
		},
		preload: function preload() {
			this.game.stage.backgroundColor = "#ffffff";
			this.game.load.image('1', './img/tree1.png');
			this.game.load.image('2', './img/tree2.png');
			this.game.load.image('3', './img/tree3.png');
			this.game.load.image('4', './img/flower.png');

			var id = "123123";
			var openid = ~~(Math.random() * 10000).toString();
			var headimg = "https://shp.qpic.cn/bizmp/CQ3lYf0saco7sJYbFrn3jvMxDJHjqZqiaqtGMtMNSqnW6DwcRD6qwGA/";
			var nickname = "eee";
			handler = new WSSocket({
				id: id,
				openid: openid,
				headimg: headimg,
				nickname: nickname,
				onMessage: function onMessage(data) {
					receive(data);
				}
			});
			this.game.state.start('create');
		},
		create: function create() {
			console.log(1);
			this.game.world.resize(1830, 1230);
			for (var p in maze) {
				for (var q in maze[p]) {
					console.log(p);
					this.game.add.sprite(p * 30, q * 30, 30, 30, '1');
				}
			}
		},
		update: function update() {},
		render: function render() {}
	};

	MazeGame.init();
})();

var maze = [];
var handler = null;

function receive(res) {
	var obj = JSON.parse(res.data);
	var _type = obj.code;
	switch (_type) {
		case -1:
			break;
		case 1:
			console.log(obj.user.nickname + "加入了游戏");
			break;
		case 0:
			console.log(obj.operation.nickname + "移動至x:" + obj.operation.position.x + ",y:" + obj.operation.position.y);
			maze.come(obj.operation.position.x, obj.operation.position.y);
			break;
		case 200:
			maze = obj.maze;
			game.state.start('create');
			break;
		case 403:
			console.log(obj.msg);
			break;
		default:
			break;
	}
}

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
			_this.handler.send(JSON.stringify({
				id: obj.id,
				type: "join",
				openid: obj.openid,
				headimg: obj.headimg,
				nickname: obj.nickname
			}));
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
			this.handler && this.handler.send(JSON.stringify({
				id: this.id,
				type: "operate",
				pos: data,
				openid: this.openid,
				headimg: this.headimg,
				nickname: this.nickname
			}));
		}
	}]);

	return WSSocket;
}();

/***/ })
],[0]);