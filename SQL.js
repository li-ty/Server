//************直接连接方式****************************
//MySQL
var mysql = require('mysql'); //$ npm install mysql
var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : '000000',
port : 3306,
database : 'test'
});
connection.connect();
connection.query('select * from user', function (err, rows,) {
if (err) throw err
for(var i=0; i<=rows.length; i++){
console.log(rows[i]);
}

});
connection.end();

//Oracle
const oracledb = require('oracledb'); //npm install oracledb
const config = {
user: '<your db user>', // Update me
password: '<your db password>', // Update me
connectString: 'localhost:1521/orcl' // Update me
};

async function getEmployee(empId) {
let conn;

try {
conn = await oracledb.getConnection(config);

const result = await conn.execute(
  'select * from employees where employee_id = :id',
  [empId]
);
console.log(result.rows[0]);
} catch (err) {
console.log('Ouch!', err);
} finally {
if (conn) { // conn assignment worked, need to close
await conn.close();
}
}
}

getEmployee(101);

//***************连接池方式连接***************************
//1.安装mysql支持
//npm install mysql
//2.安装node.js的mysqlpool模块
//npm install -g node-mysql //-g表全局
//3.创建连接池类
//OptPool.js

var mysql = require('mysql'); //调用MySQL模块
function OptPool(){
this.flag=true; //是否连接过
this.pool = mysql.createPool({
host: 'localhost', //主机
user: 'root', //MySQL认证用户名
password: 'root', //MySQL认证用户密码
database: 'test',
port: '3306' //端口号
});

this.getPool=function(){ 
    if(this.flag){ 
        //监听connection事件 
        this.pool.on('connection', function(connection) {  
            connection.query('SET SESSION auto_increment_increment=1'); 
            this.flag=false; 
        }); 
    } 
    return this.pool; 
} 
};
module.exports = OptPool;

//调用：
var OptPool = require('./models/OptPool');

var optPool = new OptPool();
var pool = optPool.getPool();

//执行SQL语句
pool.getConnection(function(err,conn){
//----插入
var userAddSql = 'insert into user (uname,pwd) values(?,?)';
var param = ['eee','eee'];
conn.query(userAddSql,param,function(err,rs){
if(err){
console.log('insert err:',err.message);
return;
}
console.log('insert success');
//conn.release(); //放回连接池
})
//查询
conn.query('SELECT * from user', function(err, rs) {
if (err) {
console.log('[query] - :'+err);
return;
}
for(var i=0;i<rs.length;i++){
console.log(rs[i].uname);
}
conn.release(); //放回连接池
});
});
