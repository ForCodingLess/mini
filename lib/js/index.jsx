import React from "react";
import ReactDOM from "react-dom";
import Extra from "./extra.js";
import '../style/index.scss';

class Main extends React.Component{
	constructor(props){
		super(props)

		this.state={
			id:"",
			openid:"",
			headimg:"",
			nickname:""
		}

		this.init=this.init.bind(this)
		this.receive=this.receive.bind(this)
		this.pushMsgQueue=this.pushMsgQueue.bind(this)

		this.preload=this.preload.bind(this)
		this.create=this.create.bind(this)
		this.update=this.update.bind(this)
	}

	preload(){
		this.game.load.image('tree1','')
	}
	create(){}
	update(){}

	init(id,openid,nickname,headimg){
		this.handler=new Extra.Socket({
			id:id,
			openid:openid,
			headimg:headimg,
			nickname:nickname,
			onMessage:(data)=>{
				this.receive(data)
			}
		})
	}

	componentWillMount(){
		
	}

	pushMsgQueue(){
	  this.timer = setTimeout(()=>{this.pushMsgQueue}, 100)
	  if (this.tap) {
	    let code = this.touch.next()
	    this.maze.go(code)
	    this.MsgFlag = true
	  }
	  if (this.MsgFlag) {
	    let pos = this.maze.getPos()
	    this.handler.send(JSON.stringify({
	      type: 'operate',
	      id: this.state.id,
	      openid: this.state.openid,
	      nickname: this.state.nickname,
	      headimg: this.state.headimg,
	      position: { x: 1800 - pos.x, y: 1200 - pos.y }
	    }))
	    this.MsgFlag = false
	  }
	}

	receive(res){
 		let obj = JSON.parse(res.data)
	  	let _type = obj.code
	    switch (_type) {
	      case -1:
	        break
	      case 1: console.log(obj.user.nickname + "加入了游戏")
	        break
	      case 0:
	        console.log(obj.operation.nickname + "移動至x:" + obj.operation.position.x + ",y:" + obj.operation.position.y)
	        this.maze.come(obj.operation.position.x, obj.operation.position.y)
	        break
	      case 200:
	        this.maze = new Extra.Maze(obj.maze, obj.location, obj.other, 30, 'game')
	        this.touch = new Extra.Touch(100, 100)
	        this.pushMsgQueue()
	        break
	      case 403:
	        console.log(obj.msg)
	        break
	      default: break
	    }
	}

	componentDidMount(){
		let id="123123"
		let openid=~~(Math.random()*10000).toString()
		let headimg="https://shp.qpic.cn/bizmp/CQ3lYf0saco7sJYbFrn3jvMxDJHjqZqiaqtGMtMNSqnW6DwcRD6qwGA/"
		let nickname="做梦吧"
		this.setState({
			id:id,
			openid:openid,
			headimg:headimg,
			nickname:nickname
		},()=>{
			this.init(id,openid,nickname,headimg)
		})
		this.game=new Phaser.Game(375,667,Phaser.AUTO,'game',{preload:this.preload,create:this.create,update:this.update})
	}

	render(){
		return(
			<div id="game">

			</div>
		)
	}
}


ReactDOM.render(
	<Main/>,
	document.getElementById("container")
)