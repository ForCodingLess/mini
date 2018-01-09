import React from 'react';
import ReactDOM from 'react-dom';
import Redux from 'readux';
import {connect} from 'react-redux';
import {UserList} from './react-util.jsx';


const inviteUser=openid=>{
	
}

const mapStateToProps=state=>{
	return{
		userlist
	}
}

const mapDispatchToProps=dispatch=>{
	return{
		onClickToDo:openid=>{
			dispatch(inviteUser(openid))
		}
	}
}



