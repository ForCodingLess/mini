var express=require("express");
var app=express();
var path=require("path");
var http=require("http").Server(app);
var uuid=require("uuid/v4");
var bodyParser=require("body-parser");


app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

http.listen(3000,()=>{
	console.log('listening on 3000');
})