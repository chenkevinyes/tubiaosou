//����ģ��
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var gmtools = require('./gmtools.js')
var dbtools_myimgs = require('./dbtools_myimgs.js');

// Ŀ����ַ
//var url = 'http://desk.zol.com.cn/meinv/1920x1080/2.html';


/*
// ��������
request(url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        $('.photo-list-padding a img').each(function() {
            var src = $(this).attr('src');
            src = src.replace(/t_s208x130c5/, 't_s960x600c5');
            links.push(src);
        });
        // ÿ��ִֻ��һ���첽����
    }
});
*/

function downloadwximg(url,userid){

	// ���ش洢Ŀ¼
	//var dir = '/usr/local/src/1/node-v8.9.1-linux-x64/web/up/'+userid;
	var dir = './web/up/'+userid;

	// ͼƬ���ӵ�ַ
	var links = [];
	links.push(url);
	
	// ����Ŀ¼
	mkdirp(dir, function(err) {
	    if(err){
	        console.log(err);
	    }else{
			  async.mapSeries(links, function(item, callback) {
			      download(item, dir, Math.floor(Math.random()*10000000)+'.jpg',function(err){
			      	if (err)
			      	{
			      		
			      	}else{
			      		callback(null, item);		
			      	}			      	
			      });
			      
			  }, function(err, results) {console.log(err)});	    	
	    }
	});	
}

// ���ط���
var download = function(url, dir, filename,callback){
		console.log('filename:'+filename);
    request.head(url, function(err, res, body){
    	if (err) {
    		console.log(err);
    		callback(err);
    	}else{
        request(url).pipe(fs.createWriteStream(dir + "/" + filename)
        	.on('close',function(){
	        	console.log('download ok,begin sample image.'+dir + "/" +filename);
	        	gmtools.sampleimg(dir+'/'+filename);	
	        	urlpath = dir.substr(5)+'/'+filename;
	        	console.log(urlpath);
	        	dbtools_myimgs.insertmyimg(urlpath);
						callback(null);	        	
	        })
        	.on('error',function(){
	        	console.log('download error'+urlpath);
	        	callback(err);
	        })	        
        );            		
    	}
    });
};
exports.downloadwximg = downloadwximg