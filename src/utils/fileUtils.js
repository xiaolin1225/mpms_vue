export const downloadFile = (url, fileName, suffix) => {
    let x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        console.log('x.response', x.response)
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName + (suffix.trim().length > 0 ? '.' + suffix : '');
        a.click();
    }
    x.send();
}


export const fileSizeByteToM = (a, b) => {
    if (0 === a) return "0 B";
    let c = 1024;
    let d = b || 2;
    let e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

export const imageSrcHandler = (src) => {
    return /data:image\/.*;base64/.test(src) ? src : (process.env.VUE_APP_API_URL + src).replace("//", "/");
}