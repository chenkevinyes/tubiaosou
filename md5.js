/**
 * Created by p.chen on 2014/7/25.
 */
//var wwwroot = "C:\\1\\cocos2d-html5-develop";
var crypto = require('crypto');
function md5(text){
  return crypto.createHash('md5').update(text).digest('base64');
}
console.log(md5('abcd'))
