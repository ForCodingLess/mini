import React from "react";
import ReactDOM from "react-dom";
import Phaser from '../../node_modules/phaser/build/phaser.min.js';

class GameContructor extends React.Component{
	constructor(props){
		super(props)

		this.state={

		}

		this.game=null
	}

	componentWillMount(){

	}

	componentDidMount(){
		this.game=new Phaser.Game(400,400,Phaser.AUTO,'phaser')
	}

	render(){
		return(
			<div>
				<div id="phaser"></div>
			</div>
		)
	}
}


ReactDOM.render(
	<GameContructor/>,
	document.getElementById("container")
)