var express = require('express');
var app = express();
app.get('/',function(req,res){    
    res.sendFile(__dirname+'/index.html');
});
var server = app.listen(4000,function(){});