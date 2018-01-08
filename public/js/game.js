var handler=null;

function invite(openid){
	handler.send({
		from:{
			openid:handler.openid,
			nickname:handler.nickname,
			headimg:handler.headimg
		},
		to:{
			openid:openid
		}
	},'invite');
}

function promise(dom){
	let openid=dom.getAttribute('data-id');
	handler.send({
		openid1:openid,
		openid2:handler.openid
	},'promise');
}

class WSSocket{
	constructor(obj){
		this.handler=new WebSocket(config.WSS);

		this.id=obj.id;
		this.openid=obj.openid;
		this.headimg=obj.headimg;
		this.nickname=obj.nickname;

		this.handler.onopen=()=>{
			console.log("连接已打开");
			this.send(null,'login');
		}

		this.handler.onclose=()=>{
			this.handler=null;
		}

		this.handler.onmessage=(res)=>{
			obj.onMessage(res);
		}

		this.send=this.send.bind(this);
	}

	send(data,type='operate'){
		if(this.handler){
			switch(type){
				case 'operate':
					this.handler.send(JSON.stringify({
						id:this.id,
						type:type,
						pos:data,
						openid:this.openid
					}));
					break;
				default:
					this.handler.send(JSON.stringify({
						id:this.id,
						type:type,
						pos:data,
						openid:this.openid,
						headimg:this.headimg,
						nickname:this.nickname
					}))
					break;
			}
		}
	}
}

class Tree extends Phaser.Sprite{
	constructor(game,x,y,width=40,height=40){
		let key=game.rnd.between(1,4);
		super(game,x,y,key);
		this.width=width;
		this.height=height;
		this.inputEnabled=false;
		game.physics.arcade.enable(this);
		this.body.collideWorldBounds=true;
		this.body.immovable=true;
	}
}

class Player extends Phaser.Sprite{
	constructor(game,x,y,key,width=30,height=30){
		super(game,x,y,key);
		this.width=width;
		this.height=height;
		game.physics.arcade.enable(this);
		this.smoothed=false;
		this.body.collideWorldBounds=true;
		game.world.add(this);
	}
}

class Control extends Phaser.Button{
	constructor(game,x,y,key1,key2,width1=90,height1=90,width2=110,height2=110){
		super(game,x,y,key1);
		this.width=width1;
		this.anchor.setTo(0.5,0.5);
		this.fixedToCamera=true;
		this.height=height1;
		this.smoothed=true;
		this.visible=true;
		game.world.add(this);

		this.child=new Phaser.Button(game,0,0,key2);
		this.child.width=width2;
		this.child.height=height2;
		this.child.anchor.setTo(0.5,0.5);
		this.child.smoothed=true;
		this.child.visible=true;
		this.addChild(this.child);

		this.move=this.move.bind(this);
		this.tap=this.tap.bind(this);
		this.cancel=this.cancel.bind(this);
	}

	move(x,y){
		let _x=this.worldPosition.x;
		let _y=this.worldPosition.y;
		let _ang=Phaser.Math.angleBetweenY(_x,_y,x,y);
		let _desX=(this.child.width)*Math.sin(_ang);
		let _desY=(this.child.width)*Math.cos(_ang);
		this.child.position.x=_desX;
		this.child.position.y=_desY;
	}

	tap(x,y){
		this.fixedToCamera=false;
		this.position.x=x;
		this.position.y=y;
		this.child.position.x=0;
		this.child.position.y=0;
		this.child.visible=true;
		this.fixedToCamera=true;
	}

	cancel(){
		this.child.visible=false;
	}
}

var maze=[];
var data1={},data2={};
var player1;
var player2;
var game;
var dialog;
var timer;

class MazeGame{
	constructor(){
		this.game=new Phaser.Game("100","100",Phaser.CANVAS,'container');
		this.game.state.add('preload',this.preload);
		this.game.state.add('create',this.create);
		this.game.state.add('play',this.play);
		this.game.state.add('over',this.over);

		this.game.state.start('preload');

		this.render=this.render.bind(this);
		this.receive=this.receive.bind(this);
	}
	preload(){
		this.preload=()=>{
			this.game.load.crossOrigin='anonymous';
			this.game.stage.backgroundColor="#ffffff";

			this.game.load.image('1','./img/tree1.png');
			this.game.load.image('2','./img/tree2.png');
			this.game.load.image('3','./img/tree3.png');
			this.game.load.image('4','./img/flower.png');

			this.game.load.image('c1','./img/c1.png');
			this.game.load.image('c2','./img/c2.png');

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
		var controller;
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

			player1=new Player(this.game,data1.x*40+5,data1.y*40+5,'p1');
			player2=new Player(this.game,data2.x*40+5,data2.y*40+5,'p2');
			
			var position={};
			var touch=false;
			controller=new Control(this.game,60,60,'c1','c2');

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
				if(!isTap&&touch){
					let _x=x-position.x;
					let _y=y-position.y;
					if(Math.abs(_x)>Math.abs(_y)){
						if(x>position.x){
							player1.body.velocity.x=250;
						}else{
							player1.body.velocity.x=-250;
						}
					}
					else{
						if(y>position.y){
							player1.body.velocity.y=250;
						}else{
							player1.body.velocity.y=-250;
						}
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
				handler.send(null,'over');
				this.game.state.start('over',true,false);
			},null,this);
		}
	}

	over(){
		this.create=()=>{
			
		}
	}

	render(x,y){
		this.game.add.tween(player2).to({x:x,y:y},50,Phaser.Easing.Linear.None,true,0,0);
	}

	receive(msg=''){
		if(this.game.state.current!='over'){
        	clearInterval(timer);
        	this.game.state.start('over');
        }
        alert(msg);
        this.game.destroy();
	}
}

$(function(){
	let openid=$.fn.cookie('openid');
	let headimg=$.fn.cookie('headimg');
	let nickname=decodeURIComponent($.fn.cookie('name'));
	if(!!openid&&!!headimg&&!!nickname){
		// openid+=~~(Math.random()*10000);
		handler=new WSSocket({
			openid:openid,
			headimg:headimg,
			nickname:nickname,
			onMessage:(res)=>{
				let obj = JSON.parse(res.data);
	  			let _type = obj.code;
	  			switch(_type){
	  				case 200:
	  					$("#list").css("display","none");
	  					$("#container").css("display","block");
				      	maze=obj.maze;
				      	data1=obj.location;
				      	data2=obj.other;
				      	game=new MazeGame();
				      	break;
			      	case 0:
			      		game.render(obj.operation.pos.x,obj.operation.pos.y);
			      		break;
		      		case 520:
		      			game.receive(obj.msg);
		      			game=null;
		      			$("#list").css("display","block");
	  					$("#container").css("display","none");
		      			break;
	      			case -1:
	      				$(`#${obj.openid}`).remove();
	      				break;
      				case 1:
      					var str="";
      					for(let user of obj.list){
      						str+=`<div class='userlist' id='${user.openid}'>
  									<div class='avatar' style='background-image:url("${user.headimg}")'>
  									</div>
  									<div class='nickname'>
  										${user.nickname}
  									</div>`;
							if(user.status===1){
								str+=`<div class='invitebt'>
										<a class='weui-btn weui-btn_mini weui-btn_primary' href='javascript:invite("${user.openid}");'>邀请</a>
  										</div>`;
							}else{
								str+=`<div class='invitebt'>
											游戏中
  										</div>`;
							}
      					}
      					$("#list").append(str);
      					break;
  					case 201:
  						$(`#${obj.openid} .invitebt`).html("游戏中");
  						break;
					case 202:
  						$(`#${obj.openid} .invitebt`).html(`<a class='weui-btn weui-btn_mini weui-btn_primary' href='javascript:invite("${obj.openid}");'>邀请</a>`);
  						break;
					case 403:
						alert(obj.msg);
						break;
					case 301:
						clearTimeout(dialog);
						$("#promise").attr("data-id",obj.user.openid);
						$("#avatar").css("background-image",`url('${obj.user.headimg}')`);
						$("#nickname").text(obj.user.nickname);
						$("#iosDialog1").css("display","block");
						dialog=setTimeout(function(){
							$("#iosDialog1").css("display","none");
						},8000);
						break;
					case 302:
						var id=obj.id;
						handler.id=id;
						handler.send(null,'join');
						break;
	  			}
			}
		});
		
		window.addEventListener('resize',function(){
			setTimeout(()=>{
				game.game.scale.setGameSize(window.innerWidth, window.innerHeight);
			},100);
		},false);

		document.getElementById('promise').addEventListener('click',function(){
			promise(this);
		});
	}else{
		window.location.href=config.IFRAME;
	}
})




