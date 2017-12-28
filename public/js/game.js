(function(){
	class WSSocket{
		constructor(obj){
			this.handler=new WebSocket(config.WSS)

			this.id=obj.id;
			this.openid=obj.openid;
			this.headimg=obj.headimg;
			this.nickname=obj.nickname;

			this.handler.onopen=()=>{
				console.log("连接已打开");
				this.handler.send(JSON.stringify({
					id:obj.id,
					type:"join",
					openid:obj.openid,
					headimg:obj.headimg,
					nickname:obj.nickname
				}))
			}

			this.handler.onclose=()=>{
				this.handler=null
			}

			this.handler.onmessage=(res)=>{
				obj.onMessage(res);
			}
		}

		send(data){
			this.handler&&this.handler.send(JSON.stringify({
				id:this.id,
				type:"operate",
				pos:data,
				openid:this.openid,
				headimg:this.headimg,
				nickname:this.nickname
			}));
		}
	}

	class MazeGame{
		constructor(){
			let id="123123";
			let openid=~~(Math.random()*10000).toString();
			let headimg="https://shp.qpic.cn/bizmp/CQ3lYf0saco7sJYbFrn3jvMxDJHjqZqiaqtGMtMNSqnW6DwcRD6qwGA/";
			let nickname="eee";
			this.handler=new WSSocket({
				id:id,
				openid:openid,
				headimg:headimg,
				nickname:nickname,
				onMessage:(data)=>{
					this.receive(data)
				}
			});
			
			this.game=new Phaser.Game(345,667,Phaser.Auto,'container');
			this.game.state.add('preload',this.preload);
			this.game.state.add('create',this.create);
			this.game.state.add('play',this.play);
			this.game.state.add('render',this.render);
			this.game.state.start('preload');
		}
		preload(){
			this.preload=()=>{
				this.game.stage.backgroundColor="#ffffff";
				this.game.load.image('1','./img/tree1.png');
				this.game.load.image('2','./img/tree2.png');
				this.game.load.image('3','./img/tree3.png');
				this.game.load.image('4','./img/flower.png');
			}
		}
		create(){
			this.create=()=>{
				console.log(this.maze)
				for(let p in this.maze){
					for(let q in this.maze[p]){
						console.log(p)
						this.game.add.sprite(p*30,q*30,30,30,'1')
					}
				}
			}
		}
		play(){

		}
		render(){

		}

		receive(res){
			let obj = JSON.parse(res.data);
		  	let _type = obj.code;
		    switch (_type) {
		      case -1:
		        break;
		      case 1: console.log(obj.user.nickname + "加入了游戏");
		        break;
		      case 0:
		        console.log(obj.operation.nickname + "移動至x:" + obj.operation.position.x + ",y:" + obj.operation.position.y);
		        break;
		      case 200:
		      	this.game.state.add('')
		      	this.maze=obj.maze;
		      	this.game.state.start('create');
		        break;
		      case 403:
		        console.log(obj.msg);
		        break;
		      default: break;
		    }
		}
	}

	var game=new MazeGame();

	console.log(game.handler)

})()


