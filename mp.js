/*个人订阅号相关js*/
var crypto = require('crypto');
var https=require('https');
var xmlreader=require("xmlreader");
var fs=require('fs');
var config=require("config");

var mysql=require('./db.js');

var mp={};
var token=config.get("Default.mpConfig.token");
var appid=config.get("Default.mpConfig.appid");
var appSecret=config.get("Default.mpConfig.appSecret");

/*微信回调签名验证*/
mp.checkSignature=function(req,res){
	var signature=req.query.signature;
	var timestamp=req.query.timestamp;
	var nonce=req.query.nonce;
	var echostr=req.query.echostr;

	var arr=[token,timestamp,nonce];
	arr.sort();
	var temp="";
	for(i=0;i<arr.length;i++){
		temp+=arr[i];
	}
	var sha1=crypto.createHash("sha1");
	sha1.update(temp);
	var newsignture=sha1.digest("hex");
	if(newsignture===signature){
		res.send(echostr);
	}
}

mp.receiveText=function(req,res){
	xmlreader.read(req.body.postData,function(err,body){
		if(null!==err){
			console.log(err);
			return;
		}else{
			let ownerid=body.ToUserName;
			let openid=body.FromUserName;
			let msgtype=body.MsgType;
			let time=new Date().getTime();
			mysql.query("select * from wx_mp_whitelist where openid='"+openid+"'",(rst)=>{
				if(rst.length===1){
					
				}
			})
		}
	})
}

mp.downloadImg=function(req,res){
	var openid=req.query.openid;
	var url=decodeURIComponent(req.query.img);
	https.get(url,(result)=>{
		var imgData="";
		result.setEncoding('binary');
		
		result.on('data',(d)=>{
			imgData+=d;
		})

		result.on('end',()=>{
			fs.writeFile('./public/avatar/'+openid+".png",imgData,'binary',(err)=>{
				if(err){
					console.log(err);
					res.send({
						success:false,
						msg:"获取头像失败"
					})
				}else{
					res.send({
						success:true,
						url:'./avatar/'+openid+".png",
						msg:""
					});
				}
			})
		})
	})

}



module.exports=mp;