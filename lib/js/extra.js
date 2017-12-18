 class Extra{
	constructor(){

		this.data={
			id:"1212",
			openid:"adfasdf"+(~~(Math.random()*10000)),
			headimg:"123",
			nickname:"123"
		}

		this.handler.onopen=()=>{
			console.log("连接已打开");
			this.handler.send(JSON.stringify({
				id:this.data.id,
				type:"join",
				openid:this.data.openid,
				headimg:this.data.headimg,
				nickname:this.data.nickname
			}))
		}

		this.handler.onclose=()=>{
			this.handler=null
		}

		this.handler.onmessage=(data)=>{
			console.warn(data);
		}
	}

	send(data){
		this.handler&&this.handler.send(JSON.stringify({
			id:this.data.id,
			type:"operate",
			pos:data,
			openid:this.data.openid,
			headimg:this.data.headimg,
			nickname:this.data.nickname
		}));
	}
}

module.exports={
	Socket:Extra
}