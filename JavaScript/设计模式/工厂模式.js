
//根据不同的传递参数返回不同的实例对象
function UserFactory(role) {
    function User(role, pages) {
        this.role = role;
        this.pages = pages;
    }
    switch (role) {
        case "superadmin": return new User("superadmin", ["home", "user-manage", "right-manage", "news-manage"]);
        case "admin": return new User("admin", ["home", "user-manage", "news-manage"]);
        case "editor": return new User("editor", ["home", "news-manage"]);
        default:
            throw new Error('参数错误');
    }
}
//console.log(UserFactory("superadmin"))

//es6写法
class User{
    constructor(role, pages){
        this.role = role;
        this.pages = pages;
    }
    static UserFactory(role){
        switch (role) {
            case "superadmin": return new User("superadmin", ["home", "user-manage", "right-manage", "news-manage"]);
            case "admin": return new User("admin", ["home", "user-manage", "news-manage"]);
            case "editor": return new User("editor", ["home", "news-manage"]);
            default:
                throw new Error('参数错误');
        }
    }
}

//console.log(User.UserFactory("admin"))