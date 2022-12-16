var express = require('express');
var app = express();
app.get('/getUserByStudentNo',function(req,res){
    //获取请求参数studentNo
    var studentNo = req.query.studentNo;
    //获取请求的回调函数callback
    var callbackFn = req.query.callback;
    var result;
    //模仿服务端查询请求
    if(+studentNo === 1001){
        result = {
            studentNo:1001,
            name:'cao teacher',
            age:18
        };
    }else{
        result = {
            studentNo:1002,
            name:'cao teacher2',
            age:28
        }
    };
    //将数据处理为JSON格式
    var data = JSON.stringify(result);
    //向客户端发送响应
    res.writeHead(200,{'Content-type':'application/json'});
    //返回值是对回调函数的调用，将data作为参数传入
    res.write(callbackFn+'('+data+')');
    res.end();
})
var server = app.listen(3000,function(){});