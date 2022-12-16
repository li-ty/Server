var express = require('express');
//接收post请求体数据的插件
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

//接收"/"请求，指定首页
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');        
});
//处理get请求
app.get('/getUser',function(req,res){
    console.log(req.query);
});
//处理post请求
app.post('/saveUser',function(req,res){
    //请求体中中的参数    
    console.log(req.body);    
    //请求url中的参数    
    console.log(req.query);
});
//执行监听的端口号
var server = app.listen(3000,function(){});