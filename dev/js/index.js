import '../style/index.scss';
import outControl from '../../public/img/c1.png';
import innerControl from '../../public/img/c2.png';

class Control extends Phaser.Button{
	constructor(game,x,y,key1,key2,width1=60,height1=60,width2=80,height2=80){
		super(game,x,y,key1);
		this.width=width1;
		this.anchor.setTo(0.5,0.5);
		this.fixedToCamera=true;
		this.height=height1;
		this.smoothed=true;
		this.visible=true;

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

class Player extends Phaser.Sprite{
	constructor(game,x,y,key,frame,width=40,height=90){
		super(game,x,y,key,frame);
		this.scale.set(0.3);
		this.anchor.setTo(0,1);
		game.physics.arcade.enable(this);
		this.body.collideWorldBounds=true;

		this.moveLeft=this.moveLeft.bind(this);
		this.moveRight=this.moveRight.bind(this);
		this.jump=this.jump.bind(this);

		this.animations.add('left');
		this.animations.add('right');
		this.animations.add('up');
	}

	moveLeft(){
		this.body.velocity.x=-200;
		this.play('left',null,true);
	}
	moveRight(){
		this.body.velocity.x=200;
		this.play('right',null,true);
	}
	jump(){
		this.body.velocity.y=-400;
		this.body.acceleration.y=300;
		this.play('up',null,true);
	}
}

class Marry extends Phaser.Game{
	constructor(width,height,dom,type=Phaser.AUTO){
		super(width,height,type,dom);
		this.state.add('preload',this.loading);
		this.state.add('create',this.ready);
		this.state.add('play',this.play);
		this.state.add('over',this.over);

		this.state.start('preload');
	}

	loading(){
		this.preload=()=>{
			this.load.image('sprite',mario);
			this.load.image('c1',outControl);
			this.load.image('c2',innerControl);
		}
		this.create=()=>{
			this.state.start('create');
		}
	}

	ready(){
		this.create=()=>{
			this.state.start('play');
		}
	}

	play(){
		this.player=null;
		this.controler=null;
		this.create=()=>{
			this.player=new Player(this.game,200,600,'sprite');
			this.controler=new Control(this.game,60,"60",'c1','c2');
			this.world.add(this.player);
			this.world.add(this.controler);
			this.game.camera.follow(this.player);
		}
	}

	over(){

	}
}

(function(){
	var game=new Marry("100","100",'container');
})()