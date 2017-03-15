/**
 * ------------------------------------------
 * 完美的运动框架组件
 *
 * 可以解决的运动
 *   - 元素的上下左右匀速 缓冲运动
 *   - 图片的透明度变化
 *   - 图片轮播
 *   - 元素高度 宽度 边框像素的变化
 *   - 适用于多个物体运动以及链式运动
 *   - 改变元素的位置
 * ------------------------------------------
 */


/**
 * 获取实际样式函数
 * @param   {HTMLElement} element 需要寻找的样式的html节点
 * @param   {String} attr 在对象中寻找的样式属性
 * @returns {String} 获取到的属性
 * ------------------------------------------
 */
 function getStyle(element, attr) {
 	//IE
 	if (element.currentStyle) {
 		return element.currentStyle[attr];
 	}
 	//标准 
 	else {
 		return getComputedStyle(element, false)[attr];
 	}
 }

 /**
 * 运动框架主函数
 * @param {HTMLElement} element 运动对象
 * @param {JSON} json 属性: 目标值
 *   @param {String} attr 属性值
 *   @param {Number} target 目标值
 * @param {function} func 可选，回调函数，链式动画
 * ------------------------------------------
 */

var startMove = function (element, json, func) {
	var flag = true;
	//在开始运动时，关闭已有定时器
	clearInterval(element.timer);

	element.timer = setInterval(function(){
		//循环json数组
		for (var attr in json){

			//1.取得当前的属性值
			var iCurrent = 0;
			//为透明度做处理
			if (attr == "opacity") {
				iCurrent = Math.round(parseFloat(getStyle(element, attr)) * 100);
			} else {
				//用getStyle得到element的属性
			    iCurrent = parseInt(getStyle(element, attr));
			}

			//2.速度动态变化，造成缓冲效果
			var iSpeed = (json[attr] - iCurrent) / 10;
			//速度取整
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			//3.达到条件时运动结束，未达到时继续执行
			if (json[attr] === iCurrent) {
				flag = true;
			} else {
				flag = false; 
				if (attr === "opacity") {
					element.style.fliter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";//IE
					element.style.opacity = (iCurrent + iSpeed) /100;//标准 
				} else {
					element.style[attr] = iCurrent + iSpeed + "px";
				}

			}

			//4.运动终止，是否回调
			if (flag) {
				clearInterval(element.timer);
				if (func) func();
			}
	    }
	},30);	
} 