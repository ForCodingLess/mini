import React from 'react';

const User=({openid,nickname,headimg,onClickToDo,status=0})=>(
	<div className='userlist'>
		<div className='avatar' style={{"background-image":"url("+headimg+")"}}>
		</div>
		<div className='nickname'>
			{nickname}
		</div>
		<div className='invitebt'>
		{
			status==1?<div className='weui-btn weui-btn_mini weui-btn_primary' onClick={()=>onClickToDo(openid)}>邀请</div>:"游戏中"
		}
		</div>
	</div>
)

const UserList=({userlist,onClickToDo})=>(
	<div>
	{
		userlist&&userlist.map((val,index)=>(
			<User key={index} openid={val.openid} headimg={val.headimg} nickname={val.nickname} onClickToDo={onClickToDo}/>
		))
	}
	</div>
)

export default {
	UserList
}