import Decimal from "decimal.js";

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

export const debounce = (func, wait) => {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait);
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