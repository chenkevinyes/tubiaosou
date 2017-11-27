var gm = require('gm');
var path = require('path');
var mkdirp = require('mkdirp');

function sampleimg(filename){	
	pathobj = path.parse(filename);
	sdir = pathobj.dir.replace('/up/','/s./up/');
	sfilename = sdir +'/'+pathobj.base;
	console.log(pathobj);	
	console.log(sfilename)	
	mkdirp(sdir, function(err) {
	    if(err){
	        console.log(err);
	    }else{
				gm(filename).resize(32).write(sfilename,function(err){
				if(err){
	        console.log(err);
	    	}	
				});	    	
	    }
	});	
}
exports.sampleimg = sampleimg