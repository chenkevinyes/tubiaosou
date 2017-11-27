// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/local');
// cosole.log(db);
// 设置数据类型
var img2wordSchema = new mongoose.Schema({
    md5:{type:String},
    urlpath:{type:String},
    urlroot:{type:String},
    word:{type:String}
});
// 选择集合
var img2wordModel = db.model('img2words',img2wordSchema);

/*
var wordlistSchema = new mongoose.Schema({
    word:{type:String}
});
// 选择集合
var wordlistModel = db.model('wordlist',wordlistSchema);
*/



//update
/*
function updateimgwords(urlpath,words){
// 原数据字段值
var oldValue  = {urlpath:urlpath};
//var oldValue  = {_id:mongoose.Types.ObjectId('5a0958689ed921180476a080')};
// 单条件更新
var newData = {$set:{word:words}};
img2wordModel.update(oldValue,newData,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log("update");
  }
  db.close();
});
}
*/
//find
function findbyword(keyword,callback){	
	var content = {'$or':[{word:new RegExp(keyword, 'i')},{category:new RegExp(keyword, 'i')}]};
	var field = {md5:1,urlpath:1,urlroot:1,word:1};
	img2wordModel.count(content,function(err,cnt){	
	  if(err){
	    console.log(err);
	  }	else{
	  	page = 20;
	  	skipidx = 0;
	  	if (cnt > page){
	  		pagecnt = Math.round(cnt / page,0) + 1;	  		
	  		pageidx = Math.round(Math.random()*pagecnt,0);
	  		if (pageidx >= pagecnt -1	){
	  			skipidx = cnt - page;
	  		} else{
	  			skipidx = pageidx * page;	
	  		} 		
	  		
	  		//处理尾页
	  		
	  		//console.log('skipidx:'+skipidx);
	  	};	  	
			img2wordModel.find(content,field,{skip:skipidx,limit:20},function(err,result){
			  if(err){
			    console.log(err);
			    //db.close();
			  }else{
			    //console.log(result);
			    //db.close();
			    callback(result,cnt)
			  }
			});
		}
	});
}
/*
function suggestwords(callback){
	var content = {};
	var field = {word:1};
	img2wordModel.find(content,field,{limit:100},function(err,result){
	  if(err){
	    console.log(err);
	    //db.close();
	  }else{
	    //console.log(result);
	    //db.close();
	    
	    var idx =Math.round(Math.random()*20,0) ;
	    //console.log(idx);
	    suggestwords = result[idx].word;
	    suggestwords +=result[idx+20].word;
	    suggestwords +='、'+ result[idx+40].word;
			suggestwords +='、'+ result[idx+60].word;
			suggestwords +='、'+ result[idx+80].word;			
	    callback(suggestwords)
	  }
	});
	
}
*/
exports.mongodb = db
exports.findbyword = findbyword
