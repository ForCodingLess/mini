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
			nickname:"",
			width:"",
			height:""
		}

		this.init=this.init.bind(this)
		this.update=this.update.bind(this)
		this.pushMsgQueue=this.pushMsgQueue.bind(this)
	}

	init(id,openid,nickname,headimg){
		this.handler=new Extra.Socket({
			id:id,
			openid:openid,
			headimg:headimg,
			nickname:nickname,
			onMessage:(data)=>{
				this.update(data)
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

	update(res){
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
        this.setState({
          width: "1830",
          height: "1230"
        })
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
	}

	render(){
		return(
			<canvas style={{"backgroundImage":"url('./img/back.jpg') repeat"}} width={this.state.width||"100%"} height={this.state.height||"100%"} id="game">
				
			</canvas>
		)
	}
}


ReactDOM.render(
	<Main/>,
	document.getElementById("container")
)