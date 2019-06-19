
/* 工具类 */
// 选择器
// function $(selector){
//     if(document.querySelector) {
//         return document.querySelector(selector);
//     } else {
//         if (selector.indexOf('#') === 0) {
//             return document.getElementById(selector.substring(1));
//         } else if (selector.indexOf('.') === 0) {
//             return document.getElementsByClassName(selector.substring(1));
//         } else {
//             return document.getElementsByTagName(selector);
//         }
//     }
// }
// 跳转到页面底部
// function scrollToBottom() {
//     // 滚动到最下
//     const dom = $('#chatHistory')
//     dom.scrollTo(0, dom.offsetHeight);
// }
// 时间转换
function dateFormat(time, format) {
    let date = new Date(time);
    let res = format;
    if (format.indexOf('HH') > -1) {
        res = res.replace('HH', Number(date.getHours() + 1).toLocaleString('en', {minimumIntegerDigits: 2}));
    } else if (format.indexOf('H') > -1) {
        res = res.replace('H', date.getHours() + 1);
    }
    if (format.indexOf('mm') > -1) {
        res = res.replace('mm', date.getMinutes().toLocaleString('en', {minimumIntegerDigits: 2}));
    } else if (format.indexOf('m') > -1) {
        res = res.replace('m', date.getMinutes());
    }
    if (format.indexOf('ss') > -1) {
        res = res.replace('ss', date.getSeconds().toLocaleString('en', {minimumIntegerDigits: 2}));
    } else if (format.indexOf('s') > -1) {
        res = res.replace('s', date.getSeconds());
    }
    return res;
}
// function ajax(url, method, data, succ, fail) {
//     let xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//     xhr.send(data);
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             succ && succ(xhr.response)
//         } else {
//             fail && fail(xhr.response)
//         }
//     }
// }