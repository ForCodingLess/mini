import React from "react";
import ReactDOM from "react-dom";
import Extra from "./extra.js";
import '../style/index.scss';

class Main extends React.Component{
	constructor(props){
		super(props)

		this.state={

		}

		this.move=this.move.bind(this)

	}

	componentWillMount(){

	}

	componentDidMount(){
		this.handler=new Extra.Socket();
	}

	move(){
		this.handler.send(~~(Math.random()*10000))
	}

	render(){
		const style={
			"width":"100%",
			"height":"400px",
			"backgroundColor":"rgba(112,55,45,0.6)"
		};
		return(
			<div style={style} onMouseMove={this.move}>
				
			</div>
		)
	}
}


ReactDOM.render(
	<Main/>,
	document.getElementById("container")
)