var mysql=require("mysql");
var config=require("config");


var db={};

db.query=function(sqlcmd,callback){
	var connection=mysql.createConnection({
		config.get("Default.dbConfig");
	});

	connection.connect((err)=>{
		if(err){
			console.log(err);
			return;
		}
	});

	if(!sqlcmd)
		return;
	connection.query(sqlcmd,(err,rows,fields)=>{
		if(err){
			console.log(err);
			return;
		}
		callback(rows);
	});

	connection.end((err)=>{
		if(err){
			console.log(err);
			return;
		}
	});
}

module.exports=db;