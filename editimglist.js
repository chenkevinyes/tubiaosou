// ����ģ��
var mongoose = require('mongoose');
// �������ݿ�
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/admin');
// cosole.log(db);
// ������������
var monSchema = new mongoose.Schema({
    md5:{type:String},
    urlpath:{type:String},
    urlroot:{type:String},
    word:{type:String}
});
// ѡ�񼯺�
var monModel = db.model('img2words',monSchema);

findall();


//update
function updateimgwords(urlpath,words){
// ԭ�����ֶ�ֵ
var oldValue  = {urlpath:urlpath};
//var oldValue  = {_id:mongoose.Types.ObjectId('5a0958689ed921180476a080')};
// ����������
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