import '../style/index.scss';

class Player extends Phaser.Sprite{
	constructor(game,x,y,key,frame,width=40,height=90){
		super(game,x,y,key,frame);
		this.width=width;
		this.height=height;
		this.anchor.setTo(0.5,1);
		game.physics.arcade.enable(this);
		this.body.collideWorldBounds=true;

		this.moveLeft=this.moveLeft.bind(this);
		this.moveRight=this.moveRight.bind(this);
		this.jump=this.jump.bind(this);
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
		this.body.velocity.x=-200;
		this.play('up',null,true);
	}
}

class Marry extends Phaser.Game{
	constructor(width,height,dom,type=Phaser.AUTO){
		super(width,height,type,dom);
		this.loading=this.loading.bind(this);
		this.ready=this.ready.bind(this);
		this.play=this.play.bind(this);
		this.over=this.over.bind(this);
		this.state.add('preload',this.loading);
		this.state.add('create',this.ready);
		this.state.add('play',this.play);
		this.state.add('over',this.over);

		this.state.start('preload');
	}

	loading(){
		this.preload=()=>{

		}
		this.create=()=>{
			this.state.start('create');
		}
	}

	ready(){
		this.create=()=>{
			
		}
	}

	play(){

	}

	over(){

	}
}

(function(){
	var game=new Marry(500,800,'container');
})()