/**
 * Created by p.chen on 2014/7/25.
 */
var crypto = require('crypto');

var fs = require("fs");

//path模块，可以生产相对和绝对路径
var path = require("path");

//配置远程路径
var remotePath = "/usr/local/src/1/node-v8.9.1-linux-x64/web/ico/";

//获取当前目录绝对路径，这里resolve()不传入参数
//var filePath = path.resolve();
var filePath = remotePath;

//读取文件存储数组
var fileArr = [];


findimg(filePath)


function filehandle(path,name){
	fs.readFile(path+'/'+name, function(err, data) {
	    console.log(path+'/'+name);
	    // 读取文件失败/错误
	    if (err) {
	        throw err;
	    }	
	    // 读取文件成功	    
	    md5string = md5(data);
	    //console.log(md5string);
	    //写文件	
            var oneline = md5string+','+path+'/'+name+'\r\n'
	    writeImgListFile('./imglist_md5.csv',oneline)
	});
}



//读取文件目录
function findimg(filePath){
fs.readdir(filePath,function(err,files){
    if(err){
        console.log(err);
        return;
    }
    var count = files.length;
    //console.log(files);
    var results = {};
    files.forEach(function(filename){
        //filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
        
        fs.stat(path.join(filePath,filename),function(err, stats){
        		console.log(filePath+' '+filename);
            if (err){
							throw err;            	
            }             
	    //文件
            if(stats.isFile()){
                if(getdir(filename) == 'png'){
		   //console.log(filePath+'\\'+filename)
		   filehandle(filePath,filename)
                }
            }else if(stats.isDirectory()){
		   //console.log('path:'+filePath+filename)      
		   findimg(filePath+filename)           
			
            }
        });
    });
});
}


//获取后缀名
function getdir(url){
    var arr = url.split('.');
    var len = arr.length;
    return arr[len-1];
}

//获取文件数组
function readFile(readurl,name){
    console.log(name);
    var name = name;
    fs.readdir(readurl,function(err,files){
        if(err){console.log(err);return;}
        
        files.forEach(function(filename){
         // console.log(path.join(readurl,filename));

            fs.stat(path.join(readurl,filename),function(err, stats){
                if (err) throw err;
                //是文件
                if(stats.isFile()){
                    var newUrl=remotePath+name+'/'+filename;
                    fileArr.push(newUrl);
                    writeFile(fileArr)
                //是子目录
                }else if(stats.isDirectory()){
                    var dirName = filename;
                    readFile(path.join(readurl,filename),name+'/'+dirName);
                    //利用arguments.callee(path.join())这种形式利用自身函数，会报错
                    //arguments.callee(path.join(readurl,filename),name+'/'+dirName);
                }
            });
        });
    });
}


function md5(text){
  return crypto.createHash('md5').update(text).digest('base64');
}




function writeImgListFile(filename,text){
// 写入文件内容（如果文件不存在会创建一个文件）
// 传递了追加参数 { 'flag': 'a' }
//fs.writeFile(filename, text, { 'flag': 'a' }, function(err) {
fs.appendFile(filename, text, function (err) {
    if (err) {
        throw err;
    }

    console.log('Saved.'+text);

    // 写入成功后读取测试
    fs.readFile(filename, 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        //console.log('test:'+data);
    });
});
}