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
    }
}