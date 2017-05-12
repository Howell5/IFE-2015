/*1.判断arr是否为一个数组，返回一个bool值*/
var arr = new Array();
// alert(typeof(arr));
isArray(arr);

function isArray(arr) {
    output(Object.prototype.toString.call(arr) == "[object Array]"); //
}

var fn = function() {};


/*2.判断fn是否为一个函数，返回一个bool值*/
function isFunction(fn) {
    output(Object.prototype.toString.call(fn) == "[object Function]");
}
isFunction(fn);


/*3.对象深度克隆*/
function cloneObject(src) {
    var result;
    if (typeof src == "object") {
        if (Object.prototype.toString.call(src) == "[object Date]") {
            //如果引用类型是 Date 的话，也直接赋值
            result = src;
        } else {
            //引用类型为 Array 或 Object 的话，采用深度克隆
            result = (Object.prototype.toString.call(src) == "[object Array]") ? [] : {};
            for (var i in src) {
                if (src.hasOwnProperty(i)) {
                    if (typeof src[i] == "object") {
                        result[i] = cloneObject(src[i]);
                    } else {
                        result[i] = src[i];
                    }
                }
            }
        }

    } else {
        result = src;
    }
    return result;
}
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

output("abObj.a:" + abObj.a);
output("abObj.b.b1[0]:" + abObj.b.b1[0]);

output("tarObj.a：" + tarObj.a);
output("tarObj.b.b1[0]：" + tarObj.b.b1[0]);


/*4.数组去重操作*/
function uniqArray(arr) {
    var narr = [];
    for (var i = 0; i < arr.length; i++) {
        if (narr.indexOf(arr[i]) == -1) narr.push(arr[i]);
    }
    return narr;
}

var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
output(b);

/*5.simpleTrim及trim函数，用于去除一个字符串，头部和尾部的空白字符*/
function simpleTrim(str) {
    var nstr = "";
    for (var i = 0; i < str.length; i++) {
        if (str[i] != " ") nstr = nstr.concat(str[i]); //考虑到兼容性，我们严格应该将str[i]全部换为str.charAt(i)
    }
    return nstr;
}


function trim(str) {
    str = str.replace(/^\s+|\s+$/g, ""); //用一行正则达到效果
    return str;
}
//在ES5中。字符串本身定义了trim方法（删除前置及后缀的空白字符）
var str = '   hi!  ';
nstr = simpleTrim(str);
output(str);
output(nstr);


/*6.实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递 */
function each(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i);
    }
}

var arr = ['java', 'c', 'php', 'html'];

function output(item) {
    console.log(item)
}
each(arr, output);

/*7.获取一个对象里面第一层元素的数量，返回一个整数*/
function getObjectLength(src) {
    var count = 0;
    for (var i in src) {
        if (src.hasOwnProperty(i)) {
            if (src[i]) count++;
        }
    }
    return count;
}

var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
};
output(getObjectLength(obj));

// 实现element的hide
function hide (ele) {
    ele.style.display = 'none';
}

//实现element的show
function show (ele) {
    ele.style.display = '';
}


/*8.用正则表达式做简单的判断*/

//判断是否为邮箱地址
function isEmail(emailStr) {
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(emailStr)) {
        alert("wrong email!!!");
        myreg.fous();
        return false;
    } else {
        output("true");
        return true;
    }

}

//判断是否为手机号
function isMobilePhone(phone) {
    //两种方式都成立
    var myreg = /^((13[0-9]{1})|159|152)+\d{8}$/;
    var myreg1 = /^(13+\d{9})|(159+\d{8})|(153+\d{8})$/;
    if (!myreg.test(phone)) {
        alert("wrong MobilePhone!!!");
        myreg.fous();
        return false;
    } else {
        output("phonetrue");
        return true;
    }
}

//判断是否填写正确的日期，例 2017-3-17
function isDate (d) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    var result = d.match(reg);

    if(result == null){return false};

    var dt = new Date(result[1],result[3]-1,result[4]);
    if(Number(dt.getFullYear())!=Number(result[1])){return false;}
    if(Number(dt.getMonth())+1!=Number(result[3])){return false;}
    if(Number(dt.getDate())!=Number(result[4])){return false;}

    return true;
}

isMobilePhone('15279181729');


/* 8.DOM操作 */

function hasClass(element, className) {
    var classNameList = element.className.split(" ");
    if (classNameList.indexOf(className) == -1) {
        return false;
    } else {
        return true;
    }
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (!hasClass(element, newClassName)) {
        var aclass = element.getAttribute("class");
        element.setAttribute("class", aclass + " " + newClassName);
    }// } else {
    //     element.setAttribute("class", newClassName);
    // }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    var aclass = element.getAttribute("class");
    if (aclass)
        element.className = aclass.replace(oldClassName, "");
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode == siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var repos = {
        x: element.getBoundingClientRect().left,
        y: element.getBoundingClientRect().top
    };
    return repos;
}

var div = document.getElementById("b1");

// 实现一个简单Query

/**
 * $函数的依赖函数，选择器函数
 * @param   {string} selector CSS方式的选择器
 * @param   {object} root     可选参数，selector的父对象。不存在时，为document
 * @returns {Array}  返回获取到的节点数组，需要注意的是使用ID选择器返的也是数组
 */
function mQuery(selector, root) {
    var result = [];
    var allTags = root.getElementsByTagName("*");
    root = root || document;
    switch (selector[0]) {
        case "#": //id选择器
            result.push(root.getElementById(selector.substring(1)));
            break;
        case ".": //class选择器
            result = root.getElementsByClassName(selector.substring(1));
            break;
        case "[": //属性选择器
            // 属性没有值时
            if (selector.indexOf("=") === -1) {
                for (var i = 0; i < allTags.length; i++) {
                    if (allTags[i].hasAttribute(selector.slice(1, -1)) === true)
                        result.push(allTags[i]);
                }
            } else { //属性有值时
                var index = selector.indexOf("=");
                for (var i = 0; i < allTags.length; i++) {
                    if (allTags[i].getAttribute(selector.slice(1, index)) === selector.slice(index + 1, -1))
                        result.push(allTags[i]);
                }
            }
            break;
        default: //tagName
            result = root.getElementsByTagName(selector);
    }
    return result;
}



function $(selector) {
    //检测到是二级查询
    if (selector.indexOf(" ") !== -1) {
        var indexSpace = selector.indexOf(" ");
        var wraproot = mQuery(selector.slice(0, indexSpace), document)[0];
        return mQuery(selector.slice(indexSpace + 1), wraproot)[0];
    } else {
        return mQuery(selector, document)[0];
    }

}


/* 10.为element绑定事件 */

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    element.addEventListener(event, listener, false);
}

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    element.removeEventListener(event, listener, false);

}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    element.addEventListener("click", listener, false);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", function(ev) {
        if (ev.keyCode === 13) {
            listener();
        }
    })
}

/*接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法*/
$.on = function(element, type, listener) {
    return addEvent(element, type, listener);
};
$.un = function(element, type, listener) {
    return removeEvent(element, type, listener);
};
$.click = function(element, listener) {
    return addClickEvent(element, listener);
}
$.enter = function(element, listener) {
    return addEnterEvent(element, listener);
};

/*对一个列表里所有的<li>增加点击事件的监听*/


function clickHandle(ev) {
    console.log(ev.type);
}

function delegateEvent(element, tag, eventName, listener) {
    return addEvent(element, eventName, function(ev) {
        if (ev.target.tagName.toLocaleLowerCase() === tag || ev.target.className === tag) {
            listener(ev.target);
        }
    })
}
$.delegate = delegateEvent;
// $.delegate($("#list"), "li", "click", clickHandle);


$.delegate = function(selector, tag, event, listener) {
    // your implement
    return delegateEvent($(selector), tag, event, listener);
}

/*BOM*/

// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    // your implement
    var isIE = !!window.ActiveXObeject; //!-[1,]
    var isIE6 = isIE && !window.XMLHttpRequest;
    var isIE8 = isIE && !!document.documentMode;
    var isIE7 = isIE && !isIE6 && !isIE8;
    if (isIE) {
        if (isIE6) {
            alert("IE6");
        } else if (isIE8) {
            alert("IE8");
        } else if (isIE7) {
            alert("IE7");
        }
    } else {
        alert("-1");
    }
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    // your implement
    var date = new Date(); //获取当前时间
    date.setTime(date.getTime() + expiredays * 24 * 3600 * 1000); //将格式转化为cookie识别的时间格式
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + date.toUTCString();
}

// 获取cookie值
function getCookie(cookieName) {
    // your implement
    var arrCookies = document.cookie.replace(/\s+/g, "").split(";"); //去掉空格并以分号为界存入数组
    var value;
    for (var i = 0; i < arrCookies.length; i++) {
        var arr = arrCookies[i].split("=");
        if (arr[0] == cookieName) {
            value = arr[1];
            break;
        }
    }
    return value;
}

/*Ajax*/
function ajax(url, options) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                options.onsuccess(httpRequest.responseText, httpRequest);
            } else {
                options.onfail(httpRequest);
            }
        }
    }

    var requestType = (options.type == "post") ? "POST" : "GET";
    httpRequest.open(requestType, url);
    httpRequest.send();


}

/*ajax(
    'test.html',
    {
        data: {
            name: 'simon',
            password: '123456'
        },
        onsuccess: function (responseText) {
            // output(responseText);
        }
    }
);*/
