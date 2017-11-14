var React=require("react");
var ReactDOM=require("react-dom");
var phraser=require("phraser");

class GameContructor extends React.Component{
	constructor(props){
		super(props)

		this.state={

		}
	}

	render(){
		return(
			<div>
				<p>仰天大笑出门去</p>
			</div>
		)
	}
}


ReactDOM.render(
	<GameContructor/>,
	document.getElementById("container")
)