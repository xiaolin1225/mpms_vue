import Decimal from "decimal.js";
import {v4 as uuid} from 'uuid';

export const timeFix = () => {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export const welcome = () => {
    const arr = ['休息一会儿吧。', '准备吃什么呢？', '请开始你的表演！', '我猜你可能累了。']
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

export const cloneObject = data => {
    let dataStr = JSON.stringify(data);
    return JSON.parse(dataStr);
}

export const transPlayTime = time => {
    const duration = parseFloat(time);
    let minute = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    minute = minute < 10 ? "0" + minute : minute;
    sec = sec < 10 ? "0" + sec : sec;
    return minute + " : " + sec;
}

export const transLyricsTimeToPlayTime = time => {
    const reg = /(\d{2}):(\d{2})\.(\d{2})/g;
    let duration = new Decimal(0);
    time.replace(reg, (item, minute, second, millis) => {
        let minuteD = new Decimal(minute);
        let secondD = new Decimal(second);
        let millisD = new Decimal(millis);
        duration = minuteD.times(60).plus(secondD).plus(millisD.times(0.01))
    })
    return duration.toFixed(2);
}

export const transPlayTimeToLyricsTime = time => {
    let minute = Math.floor(time / 60);
    let second = Math.floor(time % 60);
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return minute + ":" + second;
}

export const debounce = (fun, wait) => {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fun.apply(context, args)
        }, wait);
    }
}

export const throttle = (fun, delay) => {
    let last;
    return function (args) {
        let that = this;
        let _args = args;
        let now = +new Date();
        if (last && last + delay > now) {
            clearTimeout(fun.id);
            fun.id = setTimeout(function () {
                last = now;
                fun.call(that, _args);
            }, delay);
        } else {
            last = now;
            fun.call(that, _args);
        }
    }
}

export const generateInitialPassword = (length) => {
    let password = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_";
    for (let i = 0; i < length; i++) {
        password += str.charAt(Math.floor(Math.random() * str.length));
    }
    return password;
}

export const createPopMenu = (x, y, list) => {
    let menuItem = document.getElementById("pop-menu");
    if (menuItem !== null) {
        document.body.removeChild(menuItem);
    }
    let container = document.createElement("div");
    let menuList = document.createElement("div");
    menuList.classList.add("pop-menu-list");
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let menuItem = document.createElement("div");
        menuItem.classList.add("pop-menu-item");
        if (element.icon) {
            let icon = document.createElement("i");
            icon.classList.add(element.icon);
            menuItem.appendChild(icon);
        }
        if (element.title) {
            let title = document.createElement("span");
            let text = document.createTextNode(element.title);
            title.appendChild(text);
            menuItem.appendChild(title);
        }
        if (element.operation) {
            menuItem.addEventListener("click", element.operation);
        }
        menuList.appendChild(menuItem);
    }
    container.appendChild(menuList);
    const clickOutside = (e) => {
        e.preventDefault();
        if (container === null) {
            document.removeEventListener("click", clickOutside);
            return;
        }
        if (container.parentNode && e.target !== container) {
            container.parentNode.removeChild(container);
            document.removeEventListener("click", clickOutside);
            container = null;
        }
    };
    container.addEventListener("click", (e) => {
        e.preventDefault();
        container.parentNode.removeChild(container);
        container = null;
        document.removeEventListener("click", clickOutside);
    })
    document.addEventListener("click", clickOutside);
    container.classList.add("pop-menu-container");
    container.id = "pop-menu";
    document.body.appendChild(container);
    let {offsetWidth, offsetHeight} = document.body;
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    if (width + x > offsetWidth)
        x -= width - 10;
    if (height + y > offsetHeight)
        y -= height - 10;
    container.style.top = y + "px";
    container.style.left = x + "px";
    container.style.zIndex = "9999";
}

export const createUUID = () => {
    return uuid().replace(/-/g, '');
}

export const deepClone = (obj) => {
    let result = typeof obj.splice === "function" ? [] : {};
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]);//如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
            } else {
                result[key] = obj[key];//如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
            }

        }
        return result;
    }
    return obj;
}