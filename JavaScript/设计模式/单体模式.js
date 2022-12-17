//简单单体
let singleton = {};

//闭包单体   闭包主要目的：保护数据
let closureSingleton = (function(){
    //私有成员
    let attr = 10;
    let func = function(){
        return attr;
    }
    return {
        attr2: 0,
        meth: function(){
            return func();
        }
    };
})();

//console.log(closureSingleton.meth())

//惰性单体
let inertSingleton = (function(){
    let uniInstance;
    function init(){
        let attr = true;
        let func = function(){
            return attr;
        }
        return {
            attr,
            func
        }
    }
    return {
        getInstance: function(){
            if(!uniInstance){
                uniInstance = init();
            }
            return uniInstance;
        }
    }
})();

// let obj =  inertSingleton.getInstance();
// let obj2 = inertSingleton.getInstance();
// console.log(obj.attr, obj2.attr)
// console.log(obj === obj2);

//分支单体
let branchSingleton = (function(){
    var diff = 1;//控制返回哪个对象
    var obj1 = {
        attr: 0
    };
    var obj2 = {
        attr: 1
    };
    switch(diff){
        case 0:
            return obj1;
        case 1:
            return obj2;
    }
})();


//console.log(branchSingleton.attr);

//其他写法
var Singleton = (function(){
    var instance;
    function User(name, age){
        this.name = name;
        this.age = age;
    }
    return function(name, age){
        if(!instance){
            instance = new User(name, age)
        }
        return instance;
    }
})()

//es6写法
class Singleton{
    constructor(name, age){
        if(!Singleton.instance){
            this.name = name;
            this.age = age;
            Singleton.instance = this;
        }
        return Singleton.instance;
    }
}