

//桥模式：特权函数
var PublicClass = function(){
    var name = "xxx";//私有变量或方法
    //特权函数
    this.getName = function(){
        return name;
    }
}

var cls = new PublicClass();
console.log(cls.getName());

//桥模式：用桥把多个单元组织在一起
//使每个单元都能独立化，可以实现自己的变化
var Class1 = function(a,b,c){
    this.a = a;
    this.b = b;
    this.c = c;
}

var Class2 = function(d,e){
    this.d = d;
    this.e = e;
}

var BridgeClass = function(a,b,c,d,e){
    this.class1 = new Class1(a,b,c);
    this.class2 = new Class2(d,e);
}