const wwwroot = '/usr/local/src/1/node-v8.9.1-linux-x64/web';
const os = require('os');
var path = require('path');     //used for file path
var fs = require('fs');
var fsextra = require('fs-extra')
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var middlewares = require('express-middlewares-js');
var xmljs = require('xml2js');
var parser = new xmljs.Parser();
var builder = new xmljs.Builder();
var Wechat = require('nodejs-wechat');
var redis = require('redis'),
    client = redis.createClient();
var dbtools = require('./dbtools.js');
var dbtools_wordlist = require('./dbtools_wordlist.js');
var dbtools_myimgs = require('./dbtools_myimgs.js');



app.set('view engine', 'jade'); // 设置模板引擎
app.set('views', __dirname+'/web/jade');  // 设置模板相对路径(相对当前目录)

app.use(bodyparser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use('/weixin', middlewares.xmlBodyParser({
  type: 'text/xml'
}));

//app.use(express.static(path.join(__dirname, 'public')));
/*
  Alternative way

var xmlBodyParser = require('express-xml-parser');
app.use('/weixin', xmlBodyParser({
  type: 'text/xml',
  limit: '1mb'
}));

*/


var opt = {
  token: 'wx_kevinyes101',
  url: '/weixin'
};
var wechat = new Wechat(opt);

app.get('/weixin', wechat.verifyRequest.bind(wechat));
app.post('/weixin', wechat.handleRequest.bind(wechat));

// you can also work with other restful routes
app.use('/api', middlewares.bodyParser());

wechat.on('event.subscribe', function(session) {
  session.replyTextMessage('欢迎您关注我们的订阅号。发送文字可查询相关的图标。大量手绘图标新鲜出炉，发送"手绘"可获取。试试发送一张照片开启【我的图库】功能。');
});

wechat.on('text', function(session) {
	//console.log(session.incomingMessage.Content)	;
	inmsg = session.incomingMessage;
	console.log(inmsg);
	word = inmsg.Content;
	if (word=='我的'){
		var userid = inmsg.FromUserName;
		var pageidx = 0;
		dbtools_myimgs.getmyimgs(userid,pageidx,function(ret,cnt){
		    //console.log(ret)
		    //res.render('view', {
		      	//list: ret
		    //	    });	
		    
		    if (ret.length > 0){				
					session.replyNewsMessage([{
					  Title: '我的图库',
					  Description: '共查询到'+cnt+' 个结果,点击查看',
					  PicUrl: 'http://webtest365.com/logo.gif',
					  //PicUrl: 'http://www.baidu.com',
					  Url: "http://webtest365.com/getmyimgs?userid="+userid+"&pageidx=0"
					}]);				
		    }else{		    		
		    		session.replyTextMessage('你的图库中还没有任何照片，请将需要上传的照片直接发送至本公众号');		    	
		    }	            				
		})		
	} else if(word=="jadetest"){
		session.replyTextMessage('http://webtest365.com/jadetest');		    	
	}
	else{
		dbtools.findbyword(word,function(ret,cnt){
		    //console.log(ret)
		    //res.render('view', {
		      	//list: ret
		    //	    });	
		    
		    if (ret.length > 0){				
					session.replyNewsMessage([{
					  Title: '['+word+']相关的图标',
					  Description: '共查询到'+cnt+' 个结果,点击查看',
					  PicUrl: 'http://webtest365.com/logo.gif',
					  //PicUrl: 'http://www.baidu.com',
					  Url: "http://webtest365.com/getimg?word="+word
					}]);				
		    }else{
		    		dbtools_wordlist.suggestwords(function(suggestwords){
		    		session.replyTextMessage('没有找到相关图标，试试查询下面的关键字：'+suggestwords);	
		    	});
					
		    }	            				
		})	
	}
});

wechat.on('image', function(session) {
	/*
  session.replyNewsMsg([{
    Title: '新鲜事',
    Description: '点击查看今天的新鲜事',
    PicUrl: 'http://..',
    Url: 'http://..'
  }]);
  */
  console.log(session.incomingMessage);
  client.lpush('myimgs',JSON.stringify(session.incomingMessage));
	session.replyTextMessage('成功上传至我的图库，回复【我的】可随时查询。');	  
});
wechat.on('voice', function(session) {
  session.replyMsg({
    Title: 'This is Music',
    MsgType: 'music',
    Description: 'Listen to this music and guess ths singer',
    MusicUrl: 'http://..',
    HQMusicUrl: 'http://..',
    ThumbMediaId: '..'
  });
});

function getXMLNodeValue(node_name,xml){
    var tmp = xml.split("<"+node_name+">");
    var _tmp = tmp[1].split("</"+node_name+">");
    return _tmp[0];
}



app.route('*/getimg?*').get(function (req, res)
{
    var word = req.query.word;
		if (word == '' | word == '、') {
			res.end();	
			return;
		}
    dbtools.findbyword(word,function(ret,cnt){
	    //console.log(ret)
	    //res.render('view', {
        	//list: ret
	    //	    });	
	    
	  if (ret.length > 0){
			console.log(ret.length)
			
			urls =[];
	    ret.forEach(function(item){
				var url = item.urlroot + item.urlpath;
				urls.push(url);
			})									
			//console.log(urls)	;
			res.render('wexin_imglist',{keyword:word,imglist:ret,totalcnt:cnt,urls:urls})
    }else{
      res.send('Null');
      res.end();	
    }	                
    //console.log('res end');
	})
});

app.route('*/getmyimgs?*').get(function (req, res)
{
    var userid = req.query.userid;
		if (userid == '') {
			res.end();	
			return;
		}
		var pageidx = req.query.pageidx;
		if (pageidx == null){
			pageidx = 0;
		}
    dbtools_myimgs.getmyimgs(userid,pageidx,function(ret,cnt){
	    //console.log(ret)
	    //res.render('view', {
        	//list: ret
	    //	    });	
	    
	  if (ret.length > 0){
			console.log(ret.length)
			
			urls =[];
	    ret.forEach(function(item){
				var url = item.urlroot + item.urlpath;
				urls.push(url);
			})									
			//console.log(urls)	;
			console.log('userid:'+userid);
			res.render('wexin_myimgs',{userid:userid,imglist:ret,totalcnt:cnt,urls:urls,pageidx:pageidx})
    }else{
      res.send('Null');
      res.end();	
    }	                
    //console.log('res end');
	})
});

app.route('*/getmyimg_single?*').get(function (req, res)
{
    var userid = req.query.userid;
		if (userid == '') {
			//res.send("userid is null");			
			res.end();	
			return;
		}
		var imgid = req.query.imgid;
		if (imgid == null){
			//res.send("imgid is null");
			res.end();	
			return;
		}
    dbtools_myimgs.getmyimgs(userid,imgid,function(ret){
	    //console.log(ret)
	    //res.render('view', {
        	//list: ret
	    //	    });	
	    
	  if (ret.length > 0){
			console.log(ret.length)
			res.send(ret)			
			res.end();	
    }else{
      //res.send('no result');
      res.end();	
    }	                
    //console.log('res end');
	})
});
app.route('*/getuser_words').get(function (req, res){
	var userid = req.query.userid;
	if (userid == null ) {
		res.send(null);
		res.end();	
		return;
	}
	dbtools_myimgs.getuser_words(userid,function(err,ret){	
		if (err){
			res.end();	
			return;						
		}else{
			res.send(ret);
			res.end();	
			return;			
		}
	});
});
app.route('*/myimg_words').get(function (req, res){
	var userid = req.query.userid;
	var imgid = req.query.imgid;
	if (userid == null ) {
		res.send(null);
		res.end();	
		return;
	}
	if (imgid == null ) {
		res.send(null);
		res.end();	
		return;
	}
	dbtools_myimgs.getimg_words(userid,imgid,function(err,ret){	
		if (err){
			res.end();	
			return;						
		}else{
			res.send(ret);
			res.end();	
			return;			
		}
	});
});

app.route('*/updatemyimgs_words').post(function (req, res)
{	
		//console.log(req.body);
    var idlist = req.body.idlist;    
    var wordlist = req.body.wordlist;
    var ispublic = req.body.ispublic;
    if ( ispublic==null){
			res.send("ispublic is not valid");
			res.end();	
			return;
    }
		if (idlist == null || idlist.length == 0) {
			res.send(null);
			res.end();	
			return;
		}
    dbtools_myimgs.updatemyimgs_words(idlist,wordlist,ispublic,function(err){	    
    	res.send(err);
      res.end();	                    
    //console.log('res end');
		})
});

app.route('/jadetest').get(function (req, res){
	res.render('wexin_test',{})
});


app.route('/*.*').get(function(req,res){
	var readfile = fs.readFile(wwwroot+req.url,function(err,data){
		//res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
		res.writeHead(200);
		if (err){
			console.error(err);
		}else{
			res.write(data);
		}
		res.end();
	})
})

client.on('ready',function(err){
    console.log('ready');
    //sub();
});

client.on('error', function(error) {
    console.log(error);   
    //sub();
});
function init(){
	//redis client
	app.listen(8080);
}
init();