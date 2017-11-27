// 引入模块
var mongoose = require('mongoose');
// 连接数据库
//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/local');
var db = require("./dbtools.js").mongodb;
// 引入模块
var mongoose = require('mongoose');
var db = require("./dbtools.js").mongodb;

var myimgsSchema = new mongoose.Schema({		
		//_id:mongoose.Schema.Types.ObjectId,
    userid:String,
    urlroot:String,
    urlpath:String,
		word:String,
		ispublic:Number,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }    
});
// 选择集合
var myimgsModel = db.model('myimgs',myimgsSchema);


function getmyimgs(userid,pageidx,callback){
	var content = {userid:userid};
	var field = {userid:1,urlpath:1,urlroot:1,ispublic:1,word:1};
	var sortfield = {_id:-1};
	console.log('mongo...');
	myimgsModel.count(content,function(err,cnt){	
	  if(err){
	    console.log(err);
	  }	else{
	  	page = 21;
	  	skipidx = 0;
	  	if (cnt > page){
	  		pagecnt = Math.round(cnt / page,0) + 1;	  			  		
	  		//pageidx = Math.round(Math.random()*pagecnt,0);
	  		//console.log('pageidx:'+pageidx);	  		
	  		/*
	  		if (pageidx >= pagecnt -1	){
	  			skipidx = cnt - page;
	  		} else{
	  			skipidx = pageidx * page;	
	  		} 
	  		*/		
	  		skipidx = pageidx * page;	
	  	};	  	
			myimgsModel.find(content,field,{sort:sortfield,skip:skipidx,limit:page},function(err,result){
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

function getmyimg_single(userid,imgid,callback){
	var content = {userid:userid,_id:mongoose.Types.ObjectId(imgid)};
	var field = {userid:1,urlpath:1,urlroot:1,ispublic:1,word:1};
	var sortfield = {_id:-1};
	myimgsModel.find(content,field,function(err,result){
	  if(err){
	    console.log(err);
	    //db.close();
	  }else{
	    //console.log(result);
	    //db.close();
	    callback(result)
	  }
	});
}

function insertmyimg(urlpath){
	var newData = {userid:userid,urlroot:'http://webtest365.com',urlpath:urlpath};
	console.log('urlpath:'+urlpath);
	myimgsModel.create(newData,function(err,result){
	  if(err){
	    console.log(err);
	  }else{
	    console.log("create success:"+result);
	  }  
	});
}
function getimg_words(userid,imgid,callback){
	console.log('imgid:'+imgid);
	var content = {userid:userid,word:{"$ne":"","$ne":null}};
	var field = {userid:1,word:1};
	myimgsModel.find(content,field,function(err,result){
	  if(err){
	    console.log(err);
	    callback(err);
	    //db.close();
	  }else{
	  	var wordlist = [];	 
	  	var usedwordlist = [] 	;

	  	var words = "";	  	
	  	var len = result.length;
	  	for (var i=0;i<len;i++){  			
  			if (result[i].id == mongoose.Types.ObjectId(imgid)){
  				console.log('id:'+result[i].id ,"imgid:"+imgid);
  				word = result[i].word;
  				if (word != null){
  					usedwordlist = word.split(',')	
  				}	  			
  				console.log("usedwordlist:"+usedwordlist)	
  			}
	  		
	  		words+=','+result[i].word;
	  	}	  	
	  	//console.log(words);
	  	if (words!=""){
	  		var wordobj = {};
	  		var tmplist = words.split(',');
	  		//console.log('tmplist:'+tmplist);	  			
	  		for (var i =0;i<tmplist.length;i++){	  			
	  			if (tmplist[i]=="") continue;
	  			var idx = wordlist.indexOf(tmplist[i])
	  			if (idx>=0) {	  				
	  				//wordlist[idx].count += 1;
	  				continue;
	  			}	  				  			
	  			wordlist.push(tmplist[i]);
					//console.log('wordlist:'+wordlist);	  			
	  		}	  		
	  	}
	    callback(null,{wordlist:wordlist,usedwordlist:usedwordlist});
	  }
	});	
}

function getuser_words(userid,callback){
	
	var content = {userid:userid,word:{"$ne":"","$ne":null}};
	var field = {userid:1,word:1};
	myimgsModel.find(content,field,function(err,result){
	  if(err){
	    console.log(err);
	    callback(err);
	    //db.close();
	  }else{
	  	var words = "";	  	
	  	var len = result.length;
	  	for (var i=0;i<len;i++){
	  		words+=','+result[i].word;
	  	}
	  	var wordlist = [];
	  	//console.log(words);
	  	if (words!=""){
	  		var tmplist = words.split(',');
	  		console.log('tmplist:'+tmplist);	  			
	  		for (var i =0;i<tmplist.length;i++){	  			
	  			if (tmplist[i]=="") continue;
	  			if (wordlist.indexOf(tmplist[i])>=0) continue;
	  			wordlist.push(tmplist[i]);
					console.log('wordlist:'+wordlist);	  			
	  		}	  		
	  	}
	    callback(null,wordlist);
	  }
	});	
}
function updatemyimgs_words(idlist,wordlist,ispublic,callback){
	var objidlist = [];
	//console.log('idlist:'+idlist,'length:'+idlist.length);
	//console.log('wordlist:'+wordlist);
	for (var i=0;i<idlist.length;i++){
		itemid = idlist[i];
		console.log(itemid+" length:"+itemid.length);	
		objidlist.push(mongoose.Types.ObjectId(itemid));
	}
	console.log(objidlist);
	var words = ""
	if (wordlist!=null){
		for (var i=0;i<wordlist.length;i++){
			word = wordlist[i];
			if (words ==""){
				words = word;
			}else{
				words+=","+word;
			}		
		}
	}
	// 条件
	var whereValue  = {_id:{$in:objidlist}};	
	// 单条件更新
	var newData = {$set:{word:words,ispublic:ispublic,updateTime:Date.now()}};
	myimgsModel.update(whereValue,newData,{multi:true},function(err,result){
	  if(err){
	    console.log(err);
	    callback(err)
	  }else{
	    console.log("update ok, words"+words);
	    callback(null);
	  }	  
	});
}

exports.insertmyimg = insertmyimg
exports.updatemyimgs_words = updatemyimgs_words
exports.getuser_words = getuser_words
exports.getimg_words = getimg_words
exports.getmyimgs = getmyimgs
exports.getmyimg_single = getmyimg_single
