var express=require("express");
var app=express();
var path=require("path");
var http=require("http").Server(app);
var uuid=require("uuid/v4");
var bodyParser=require("body-parser");

app.use('/public',express.static(path.join(__dirname,'public')));

// app.set('views',path.join(__dirname,'public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",(req,res)=>{
	res.send("index");
})

http.listen(3000,()=>{
	console.log('listening on 3000');
})