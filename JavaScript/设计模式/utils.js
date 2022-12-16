var BH = {};
BH.Interface = function(name, methods){
    if(arguments.length != 2){
        throw new Error("this instance interface constructor arguments must must be 2 lengths");
    }
    this.name = name;
    this.methods = [];
    for(var i = 0; i < methods.length; i++){
        if(typeof methods[i] !== "string"){
            throw new Error("Interface methods name must be string")
        }
        this.methods.push(methods[i]);
    }
}

BH.Interface.ensureImplements = function(object){
    if(arguments.length < 2){
        throw new Error("Interface.ensureImplements method constructor arguments must be >= 2");
    }
    for(var i = 1; i < arguments.length; i++){
        var instanceInterface = arguments[i];
        if(instanceInterface.constructor !== BH.Interface){
            throw new Error("the arguments constructor not be Interfave Class");
        }
        for(var j = 0; j < instanceInterface.methods.length; j++){
            var methodName = instanceInterface.methods[j];
            if(!object[methodName] || typeof object[methodName] !== 'function'){
                throw new Error("the methodName " + methodName + " is not found");
            }
        }
    }
}

BH.extend = function(sub, sup){
    //目的：实现只继承父类的原型对象
    var F = new Function();//1、创建一个空函数    空函数进行中转
    F.prototype = sup.prototype;//2、实现空函数的原型对象和超类的原型对象转换
    sub.prototype = new F();//原型继承
    sub.prototype.constructor = sub;//还原子类的构造器
    //保存一下父类的原型对象：一方面为了解耦；另一方面方便获得父类的原型对象
    sub.superClass = sup.prototype;
    //判断父类的原型对象的构造器（加保险）
    if(sup.prototype.constructor == Object.prototype.constructor){
        sup.prototype.constructor = sup;
    }
}


//export default BH;