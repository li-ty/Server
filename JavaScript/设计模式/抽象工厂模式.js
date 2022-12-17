//抽象工厂模式是根据不同的传参返回不同的类，而不是实例对象
class User {
    constructor(name, role, pages) {
        this.name = name;
        this.role = role;
        this.pages = pages;
    }
    welcome(){
        console.log("欢迎" + this.name);
    }
    //抽象方法不可直接调用，需要被继承重写
    showData(){
        throw new Error("需要被继承重写");
    }
}
class SuperAdmin extends User {
    constructor(name) {
        super(name, "superadmin", ["home", "user-manage", "right-manage", "news-manage"]);
    }
    showData(){
        console.log("此处编写代码逻辑控制超级管理员才能看到的数据");
    }
    addUser(){}
    deleteUser(){}
    //同理该角色下的其他方法
}
class Admin extends User {
    constructor(name) {
        super(name, 'admin', ["home", "user-manage", "news-manage"]);
    }
    showData(){
        console.log("此处编写代码逻辑控制管理员才能看到的数据");
    }
    addUser(){}
    //同理该角色下的其他方法
}
class Editor extends User {
    constructor(name) {
        super(name, "editor", ["home", "news-manage"]);
    }
    //同理该角色下的其他方法
}
function getAbstractUserFactory(role) {
    switch (role) {
        case "superadmin": return SuperAdmin;
        case "admin": return Admin;
        case "editor": return Editor;
        default:
            throw new Error('参数错误');
    }
}


// let SA = getAbstractUserFactory("admin");
// console.log(typeof SA)
// let s = new SA();
// console.log(typeof s)
// s.showData();