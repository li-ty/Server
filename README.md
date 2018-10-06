# Note for JavaScript
# ECMAScript® 2018 Language Specification https://www.ecma-international.org/ecma-262/
# ECMAScript Language's Chinese Specification http://es6.ruanyifeng.com/ or https://www.liaoxuefeng.com/

ECMAScript Standard Built-in Objects:
18 The Global Object ( https://www.ecma-international.org/ecma-262/)
  18.1 Value Properties of the Global Object (Infinity, NaN, undefined)
  18.2 Function Properties of the Global Object (eval(x), isNaN(number), parseInt(string,radix)...)
  18.3 Constructor Properties of the Global Object (Array(...), Boolean (...), Function(...), Object(...)...)
  18.4 Other Properties of the Global Object (Atomics, JSON, Math, Reflect)

Browser Build-in Objects and Methods:
Document,Element,Event,EventListener,History,Image,Location,Navigator,Node,Option,Position,Screen,Storage,Text,WebSocket,Window,XMLHttpRequest,Console...
end(),start()

Node.js是基于模块化的方式对代码进行组织和管理，采用的模块化标准是Commonjs，like this,
  //mian.js
function (exports, require, module, __filename, __dirname) { 
    console.log(arguments.callee.toString());
    console.log(__dirname);
    function f() {
        console.log("文件定义的函数");
    }
    f();

}

function (exports, require, module, __filename, __dirname) { 
   //用户编辑的代码
}
