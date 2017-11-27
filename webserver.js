/**
 * Created by p.chen on 2014/7/25.
 */
//var wwwroot = "C:\\1\\cocos2d-html5-develop";
const os = require('os')
const crypto =  require('crypto')
//var dbtools = require('./dbtools.js')

var wwwroot = '/usr/local/src/1/node-v8.9.1-linux-x64/web';

var express = require('express');    //Express Web Server
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var umltipartMiddileware = multipart();


var busboy = require('connect-busboy'); //middleware for form/file upload
//netstat –apn | grep 8080
//kill

var path = require('path');     //used for file path
var fs= require('fs');       //File System - for file manipulation
var fsextra = require('fs-extra');       //File System - for file manipulation
var stream = require("stream");

var app = express();
var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});

app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({extended:true}));

//app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

/* ==========================================================
 Create a Route (/upload) to handle the Form submission
 (handle POST requests to /upload)
 Express v4  Route definition
 ============================================================ */

app.route("/").get(function (req, res)
{
    //
    console.log(req.query);
    /*
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
	  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      
    var readfile = fs.readFile(path.join(wwwroot  , req.url), function (err, data) {
        res.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
        if (err) {
            console.error(err);
        } else {
            ///console.log(data);
            res.write(data);
        }
        res.end();
    });
    */
});


app.route("/wx_msg").post(function (req, res){
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
	  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
 //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
 	  //console.log(req);
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
            nonce = req.query.nonce,//随机数
          echostr = req.query.echostr;//随机字符串
		console.log(req.body);
    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = ['wx_kevinyes101',timestamp,nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(resultCode === signature){
        res.send('success');
    }else{
        res.send('mismatch');
    }	
})
app.route("/wx_msg").get(function (req, res)
{

	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
	  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
 //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
            nonce = req.query.nonce,//随机数
          echostr = req.query.echostr;//随机字符串
		console.log(req.query)
    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = ['wx_kevinyes101',timestamp,nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(resultCode === signature){
        res.send('success');
    }else{
        res.send('mismatch');
    }
});


app.route('*/getimg?*').get(function (req, res)
{
    var word = req.query.word;

    dbtools.findbyword(word,function(ret){
	    //console.log(ret)
	    //res.render('view', {
        	//list: ret
	    //	    });	
	    
	    if (ret.length > 0){
		console.log(ret.length)
	    ret.forEach(function(item){
		var url = item.urlroot + item.urlpath
		    res.send('<img src='+url+'>')
		})
	    }else{
              res.send('Null')
	    }	            
	    res.end();	
            console.log('res end')
	})
});




function getUrl(hName,hPort,hPath,cb)
{
 
  var http = require('http');
   var qs = require('querystring');
   var data ={
     x:1,
     y:2
     };

   var content = qs.stringify(data);
   
var options ={
     hostName:hName,
     port:hPort,
     path:hPath,
     method:'Get'
   };

     console.log('hostName:'+hName);
     console.log('port:'+hPort);
     console.log('path:'+hPath);

   var req = http.request(options,function(res){
    req.end();	
     console.log('status:'+res.statusCode);
     cb('OK',res);

  } );

  req.on('error',function(e)
  {
    req.end();
    cb('ER',e.message);


   } );
    req.end();
}
