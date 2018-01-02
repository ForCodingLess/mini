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
		constructor(game,x,y,width=40,height=40){
			super(game);
			let key=game.rnd.between(1,4);
			Phaser.Sprite.call(this,game,x,y,key);
			this.width=width;
			this.height=height;
			this.inputEnabled=false;
			game.physics.arcade.enable(this);
			this.body.collideWorldBounds=true;
			this.body.immovable=true;
		}
	}

	class Player extends Phaser.Sprite{
		constructor(game,x,y,key,width=25,height=25){
			super(game);
			Phaser.Sprite.call(this,game,x,y,key);
			this.width=width;
			this.height=height;
			game.physics.arcade.enable(this);
			this.smoothed=true;
			this.body.collideWorldBounds=true;
			game.world.add(this);
		}
	}

	class Control extends Phaser.Sprite{
		constructor(game,x,y,key1,key2,width1=70,height1=70,width2=25,height2=25,rad=35){
			super(game);
			Phaser.Sprite.call(this,game,x,y,key1);
			this.width=width1;
			this.anchor.setTo(0.5,0.5);
			this.height=height1;
			this.smoothed=true;
			game.world.add(this);

			this.child=new Phaser.Sprite(game,x,y,key2);
			this.child.width=width2;
			this.child.height=height2;
			this.anchor.setTo(0.5,0.5);
			this.child.smoothed=true;
			this.child.visible=false;
			game.world.add(this.child);
		}

		move(x,y){
			let _x=this.position.x;
			let _y=this.position.y;
			let _distance=Phaser.Math.distance(_x,_y,x,y);
			let _percent=Phaser.Math.percent(this.width1/2,_distance);
			let _desX=_x+(x-_x)*_percent;
			let _desY=_y+(y-_y)*_percent;
			this.game.add.tween(this.child).to({x:_desX,y:_desY},0,Phaser.Easing.Linear.None,true,0,0);
		}

		tap(x,y){
			this.alignIn(this.game.camera.view,Phaser.BOTTOM_LEFT);
			this.child.alignIn(this.game.camera.view,Phaser.BOTTOM_LEFT);
			// this.worldPosition.x=x;
			// this.worldPosition.y=y;
			// this.child.worldPosition.x=x;
			// this.child.worldPosition.y=y;
			this.child.visible=true;
			console.log(this)
		}

		cancel(){
			this.child.visible=false;
		}
	}

	var maze=[];
	var data1={},data2={};
	var handler=null;
	var player1;
	var player2;

	class MazeGame{
		constructor(){
			this.game=new Phaser.Game(375,620,Phaser.CANVAS,'container');
			this.game.state.add('preload',this.preload);
			this.game.state.add('create',this.create);
			this.game.state.add('play',this.play);
			this.game.state.add('over',this.over);

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

			this.game.state.start('preload');
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
				this.game.world.setBounds(0,0,1640,1230);
				this.game.physics.startSystem(Phaser.Physics.ARCADE);
				this.game.state.start('play');
			}
		}
		play(){
			var trees;
			var timer;
			var controller;
			var groups;
			this.create=()=>{
				trees=this.game.add.group();
				trees.ignoreChildInput=true;
				for(let p in maze){
					for(let q in maze[p]){
						if(maze[p][q]===0){
							trees.add(new Tree(this.game,p*40,q*40));
						}
					}
				}

				player1=new Player(this.game,data1.x*40+7,data1.y*40+7,'p1');
				player2=new Player(this.game,data2.x*40+7,data2.y*40+7,'p2');
				
				var position={};
				var touch=false;
				controller=new Control(this.game,60,60,'1','2');

				this.game.camera.follow(player1);
				this.game.input.maxPointers=1;
				this.game.input.onDown.add(function(pointer,e){
					touch=true;
					Object.assign(position,{x:pointer.clientX,y:pointer.clientY});
					controller.tap(pointer.clientX,pointer.clientY);
				})
				this.game.input.onUp.add(function(pointer,e){
					touch=false;
					position={};
					player1.body.velocity.x=0;
					player1.body.velocity.y=0;
					controller.cancel();
				})
				this.game.input.addMoveCallback(function(pointer,x,y,isTap){
					this.game.debug.pointer(this.game.input.pointer1)
					if(!isTap&&touch){
						if(x>position.x){
							player1.body.velocity.x=300;
						}else{
							player1.body.velocity.x=-300;
						}
						if(y>position.y){
							player1.body.velocity.y=300;
						}else{
							player1.body.velocity.y=-300;
						}
						controller.move(x,y);
					}
				},this.game.input.pointer1);

				timer=setInterval(()=>{
					if(touch){
						handler.send({
							x:this.game.world.width-player1.position.x-player1.width,
							y:this.game.world.height-player1.position.y-player1.height
						});
					}
				},100);
			},
			this.update=()=>{
				this.game.physics.arcade.collide(player1,trees);
				this.game.physics.arcade.overlap(player1,player2,function(){
					clearInterval(timer);
					this.game.state.start('over',true,false);
				},null,this);
			}
		}
		render(x,y){
			this.game.add.tween(player2).to({x:x,y:y},50,Phaser.Easing.Linear.None,true,0,0);
		}
		over(){
			this.create=()=>{
				
			}
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
		      	this.render(obj.operation.pos.x,obj.operation.pos.y);
		        console.log(obj.operation.nickname + "移動至x:" + obj.operation.pos.x + ",y:" + obj.operation.pos.y);
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


