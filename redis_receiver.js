var dowloadimg = require('./downloadimg.js');
var redis = require('redis'),
    client = redis.createClient();
client.on('ready',function(err){
    console.log('ready');
    sub();
});

client.on('error', function(error) {
    console.log(error);   
    //sub();
});
 
var sub = function() {
	// consumer code
	var key = "myimgs";	
	client.brpop(key,100,function(err,response){
			console.log(err,response);
			if ((err ==null ) & (response != null)){
				console.log(response.length);
				if (response.length>=2){
					incomingMessage = eval('('+response[1]+')');
					console.log(incomingMessage.PicUrl);
				  url = incomingMessage.PicUrl;
				  userid = incomingMessage.FromUserName;
				  dowloadimg.downloadwximg(url,userid);											
				}				
			}
			sub();
	});	
}

/*
client.on('connect',function(){
    client.set('author', 'Wilson',redis.print);
    client.get('author', redis.print);
    console.log('connect');
});
*/

/*
//����һ��Ƶ��
var sub = function(c) {
    //var c = c || 'roban:test:channel';
    var c = c || 'wexin-myimgs';
    client.subscribe(c,function(e){
        console.log('starting subscribe channel:'+c);
    });
};
 
//����һ��Ƶ��
sub();

client.on("subscribe", function (channel, count) {
        console.log("client subscribed to " + channel + "," + count + " otal subscriptions");
        //client.get(channel,redis.print);
});
 
//�������,������ִ���,���߷������Ͽ�������,�ȴ��ָ�ʱ,�����������Ƶ��
client.on('error', function(error) {
    console.log(error);
    sub();
});
 
 
//���Ĵ�����
client.on('message',function(err,response){
    console.log('message:'+response);
});
*/