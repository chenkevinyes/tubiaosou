// 引入模块
var mongoose = require('mongoose');
// 连接数据库
//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/local');
// cosole.log(db);
var db = require("./dbtools.js").mongodb;
console.log('mongodb:'+db)
var wordlistSchema = new mongoose.Schema({		
    word:String
});
// 选择集合
var wordlistModel = db.model('words',wordlistSchema);
function suggestwords(callback){
	//var content = {word:{"$ne":""}};
	var content = {};
	var field = {word:1};
	wordlistModel.find(content,field,{limit:80},function(err,result){
	  if(err){
	    console.log(err);
	    //db.close();
	  }else{
	    console.log(result.length);
	    totalcnt = result.length;
	    //db.close();
	    var idx1 =Math.round(Math.random()*totalcnt,0) ;
	    var idx2 =Math.round(Math.random()*totalcnt,0) ;
			var idx3 =Math.round(Math.random()*totalcnt,0) ;	    
	    //console.log(idx);
	    console.log(result)
	    suggestwords = result[idx1].word;
	    suggestwords +='、'+result[idx2].word;
	    suggestwords +='、'+ result[idx3].word;
			//suggestwords +='、'+ result[idx+60].word;
			//suggestwords +='、'+ result[idx+80].word;		
			console.log(suggestwords);	
	    callback(suggestwords)
	  }
	});
	
}
exports.suggestwords = suggestwords