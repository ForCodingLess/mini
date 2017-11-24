import React from "react";
import ReactDOM from "react-dom";
import '../style/index.scss';

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
		this.game=new Phaser.Game("100","100",Phaser.AUTO,document.getElementById("phaser"))
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