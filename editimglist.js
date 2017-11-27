// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/admin');
// cosole.log(db);
// 设置数据类型
var monSchema = new mongoose.Schema({
    md5:{type:String},
    urlpath:{type:String},
    urlroot:{type:String},
    word:{type:String}
});
// 选择集合
var monModel = db.model('img2words',monSchema);

findall();


//update
function updateimgwords(urlpath,words){
// 原数据字段值
var oldValue  = {urlpath:urlpath};
//var oldValue  = {_id:mongoose.Types.ObjectId('5a0958689ed921180476a080')};
// 单条件更新
var newData = {$set:{word:words}};
monModel.update(oldValue,newData,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log("update");
  }
  db.close();
});
}

//find
function findall(){
var content = {};
var field = {md5:1,urlpath:1,urlroot:1,words:1};
monModel.find(content,field,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log(result);
  }
  db.close();
});
}