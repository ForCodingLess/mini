import {config} from "./js/config.js"

class Extra{
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

class Scene {
  constructor(maze, sys1, sys2, cell, id) {
    this.data = {
      cell_width: cell,
      cell_height: cell,
      edgex_blank: 0,
      edgey_blank: 0,
      maze: maze,
      other: {
        x: sys2.x * cell,
        y: sys2.y * cell,
        img:sys2.img,
        name:sys2.name
      },
      man: {
        x: sys1.x * cell,
        y: sys1.y * cell,
        img: sys1.img,
        name: sys1.name
      },
      len:5
    }

    this.img=new Image()
    this.img.src="./img/tree3.png"




    let cav=document.getElementById(id)

    this.ctx = cav.getContext("2d")

    this.img.onload=()=>{
	    this.init(this.data.cell_width)
    }
  }

  init(cell_width) {
    for (let p in this.data.maze) {
      for (let q in this.data.maze[p]) {
        if (!this.data.maze[p][q].road) {
          this.drawTree(p, q);
        }
      }
    }

    /*标注初始位置*/
    this.manimg=new Image()
    this.manimg.src=sys1.img
    this.manimg.onload=()=>{
    	this.drawMan(this.data.man.x, this.data.man.y, this.manimg)
    }
    this.otherimg=new Image()
    this.otherimg.src=sys2.img
    this.otherimg.onload=()=>{
    	this.drawMan(this.data.other.x, this.data.other.y, this.otherimg)
    }
  }

  go(k) {
    let x = this.data.man.x
    let y = this.data.man.y
    let img=this.manimg
    this.clearMan(x, y)
    switch (k) {
      case 1:
        var _x = parseInt((x - this.data.len) / this.data.cell_width)
        var _y = parseInt(y / this.data.cell_height)
        var _n = y % this.data.cell_height
        if (this.data.maze[_x][_y].road && (_n == 0 || this.data.maze[_x][_y + 1].road)) {
          this.data.man.x -= this.data.len
        }
        break
      case 2:
        var _x = Math.ceil((x + this.data.len) / this.data.cell_width)
        var _y = parseInt(y / this.data.cell_height)
        var _n = y % this.data.cell_height
        if (this.data.maze[_x][_y].road && (_n == 0 || this.data.maze[_x][_y + 1].road)) {
          this.data.man.x += this.data.len
        }
        break
      case 3:
        var _x = parseInt(x / this.data.cell_width)
        var _y = parseInt((y - this.data.len) / this.data.cell_height)
        var _n = x % this.data.cell_width
        if (this.data.maze[_x][_y].road && (_n == 0 || this.data.maze[_x + 1][_y].road)) {
          this.data.man.y -= this.data.len
        }
        break
      case 4:
        var _x = parseInt(x / this.data.cell_width)
        var _y = Math.ceil((y + this.data.len) / this.data.cell_height)
        var _n = x % this.data.cell_width
        if (this.data.maze[_x][_y].road && (_n == 0 || this.data.maze[_x + 1][_y].road)) {
          this.data.man.y += this.data.len
        }
        break
    }
    this.drawMan(this.data.man.x, this.data.man.y, img)
    if (this.data.man.x == this.data.other.x && this.data.man.y == this.data.other.y) {
      console.log("成功")
    }
  }

  come(x, y, img) {
    this.clearMan(this.data.other.x, this.data.other.y)
    this.data.other.x = x
    this.data.other.y=y
    this.drawMan(x, y, this.otherimg)
    if (this.data.man.x == this.data.other.x && this.data.man.y == this.data.other.y) {
      console.log("成功")
    }
  }

  drawTree(x, y) {
    this.ctx.drawImage(this.img, this.data.edgex_blank + x * this.data.cell_width, this.data.edgey_blank + y * this.data.cell_height, this.data.cell_width, this.data.cell_width)
  }

  clearMan(x, y) {
    this.ctx.clearRect(x, y, this.data.cell_width, this.data.cell_height)
  }

  drawMan(x, y, img) {
    this.ctx.drawImage(img, x, y, this.data.cell_width, this.data.cell_height)
  }

  getPos() {
    return { x: this.data.man.x, y: this.data.man.y }
  }
}

class Touch {
  constructor(x = 100, y = 100) {
    this.x = x
    this.y = y
    this.location = {}
  }
  next() {
    var _x = this.location.x - this.x
    var _y = this.location.y - this.y
    if (Math.abs(_x) >= Math.abs(_y)) {
      if (_x > 0) {
        console.log("x+")
        return 2
      } else {
        console.log("x-")
        return 1
      }
    } else {
      if (_y > 0) {
        console.log("y+")
        return 4
      } else {
        console.log("y-")
        return 3
      }
    }
  }
  tap(x, y) {
    this.location = {
      x: x,
      y: y
    }
  }
}

module.exports={
	Socket:Extra,
	Maze:Scene,
	Touch:Touch
}