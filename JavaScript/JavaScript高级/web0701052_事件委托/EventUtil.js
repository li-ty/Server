var EventUtil = {
    addEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.removeEventListener(type, handler);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on"+type] = null;
        }
    },
    //获取事件对象
	getEvent:function(event){
		return event || window.event;
	},
    //获取事件目标元素
    getTarget:function(event){
        return event.target || event.srcElement;
    }
}