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

	class Tree extends Phaser.Sprite{
		constructor(game,x,y,width=30,height=30){
			super(game);
			let key=game.rnd.between(1,4);
			Phaser.Sprite.call(this,game,x,y,key);
			this.width=width;
			this.height=height;
			game.physics.p2.enable(this);
			this.body.immovable=false;
		}
	}

	class Player extends Phaser.Sprite{
		constructor(game,x,y,key,width=30,height=30){
			super(game);
			game.add.sprite(x,y,key);
			this.width=width;
			this.height=height;
			game.physics.p2.enable(this,false);
			this.body.immovable=true;
		}
	}

	var maze=[];
	var data1={},data2={};
	var handler=null;
	var trees;
	var player1;
	var player2;
	var cursors;

	class MazeGame{
		constructor(){
			this.game=new Phaser.Game(1830,1230,Phaser.Auto,'container');
			this.game.state.add('preload',this.preload);
			this.game.state.add('create',this.create);
			this.game.state.add('play',this.play);
			this.game.state.add('render',this.render);

			let id="123123";
			let openid=~~(Math.random()*10000).toString();
			let headimg="https://shp.qpic.cn/bizmp/CQ3lYf0saco7sJYbFrn3jvMxDJHjqZqiaqtGMtMNSqnW6DwcRD6qwGA/";
			let nickname="eee";

			handler=new WSSocket({
				id:id,
				openid:openid,
				headimg:headimg,
				nickname:nickname,
				onMessage:(data)=>{
					this.receive(data)
				}
			});
		}
		preload(){
			this.preload=()=>{
				this.game.load.crossOrigin='anonymous';
				this.game.stage.backgroundColor="#ffffff";

				this.game.load.image('1','./img/tree1.png');
				this.game.load.image('2','./img/tree2.png');
				this.game.load.image('3','./img/tree3.png');
				this.game.load.image('4','./img/flower.png');

				this.game.load.image('p1',data1.img);
				this.game.load.image('p2',data2.img);
			},
			this.create=()=>{
				this.game.state.start('create');
			}
		}
		create(){
			this.create=()=>{
				this.game.physics.startSystem(Phaser.Physics.P2JS);
				this.game.physics.p2.setImpactEvents(true);
				this.game.state.start('play');
			}
		}
		play(){
			this.create=()=>{
				trees=this.game.add.group();
				for(let p in maze){
					for(let q in maze[p]){
						if(maze[p][q]===0){
							trees.add(new Tree(this.game,p*30,q*30));
						}
					}
				}
				player1=new Player(this.game,data1.x*30,data1.y*30,'p1');
				player2=new Player(this.game,data2.x*30,data2.y*30,'p2');
				player1.body.setCollisionGroup(trees);
				player1.body.collides(trees, function(){
					console.log(1);
				}, this);
				cursors=this.game.input.keyboard.createCursorKeys();

			},
			this.update=()=>{
				// this.game.physics.p2.collide(player1,trees,function(){
				// 	return;
				// },null,this);
				if (cursors.left.isDown)
			    {
			        player1.body.moveLeft(5);
			    }
			    else if (cursors.right.isDown)
			    {
			        player1.body.moveRight(5);
			    }

			    if (cursors.up.isDown)
			    {
			        player1.body.moveUp(5);
			    }
			    else if (cursors.down.isDown)
			    {
			        player1.body.moveDown(5);
			    }
			}
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
		      	maze=obj.maze;
		      	data1=obj.location;
		      	data2=obj.other;
		      	this.game.state.start('preload');
		        break;
		      case 403:
		        console.log(obj.msg);
		        break;
		      default: break;
		    }
		}
	}

	var game=new MazeGame();

})()


