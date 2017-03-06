

/**
 * 元素拖拽实现函数
 * @param  {obj}   bar      [触发拖拽的对象]
 * @param  {obj}   target   [被拖拽的对象]
 * @param  {Function} callback [可选，回调执行函数]
 * @return {[type]}            [description]
 */
function startDrag(element,event) {
	var params = {
		currentX : 0,
		currentY : 0
	};
	var ev = event;
	var isDown = true;
	var eTop = element.offsetTop;
	params.currentX = getMousePos(ev).x - element.offsetLeft;
	params.currentY = getMousePos(ev).y - element.offsetTop;
    addClass(element, "active"); //给正在操作中的盒子增加类, 以加强交互效果
    
    document.onmouseup = function () {
    	isDown = false;
    	removeClass(element, "active");
    	var xBox = getPosition(element).x;
    	var yBox = getPosition(element).y;
    	//如果符合左边框的推人原则，就推入左边
    	if (judgeInBlock(xBox, yBox, $(".c-left"))) {
    		$(".c-left").appendChild(element);
    		init();
    		element.style.left = 0;
    	//符合右边就右边
    	} else if(judgeInBlock(xBox, yBox, $(".c-right"))) {
    		$(".c-right").appendChild(element);
    		init();
    		element.style.left = 0;
    	//都不符合的就回到原位
    	} else {
    		element.style.left = 0;
    		element.style.top = eTop + 'px';
    	}
    };

    document.onmousemove = function (ev) {
    	if (isDown) {
    		element.style.left = (getMousePos(ev).x - params.currentX) + "px";
    		element.style.top = (getMousePos(ev).y - params.currentY) + "px";
    	}

    };
	
}

//获取鼠标位置函数
function getMousePos(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { x, y };
}

/* box 事件代理函数*/
function delegateBoxDrag(element, eventName, classname, listener){
	return addEvent(element, eventName, function(event) {
		let tclassName = trim(event.target.className);
		if (tclassName === 'box') {
			listener(event.target, event);
		}
	});
}

/* 方块拖拽结束时 位置判断函数*/
function judgeInBlock(x, y, block) {
	var x0 = getPosition(block).x,
		y0 = getPosition(block).y,
		y1 = y0 + block.offsetHeight;
	// 100 是 box width的一半
	return x > (x0 - 100) && x < (x0 + 100) && y < y1 && y > y0;
}


/*  get a element's pos relative to document */
function getPosition(el) {
	var curLeft = 0,
		curTop = 0;

	do {
		if (el.offsetParent) {
			curLeft += el.offsetLeft;
			curTop += el.offsetTop;
		}
	} while (el = el.offsetParent);
	
	return {
		x: curLeft,
		y: curTop
	}
}




/* 方块init函数，让每个方块到达正确的位置及触发代理事件*/
function init() {
	initBoxPosition($(".c-left"));
	initBoxPosition($(".c-right"));

	
}

/*让方块到达正确的位置*/
function initBoxPosition(block) {
	var boxs = block.getElementsByClassName('box');
	for (let i = 0, len = boxs.length; i < len; i++) {
		boxs[i].style.top = 40 * i + 'px';
	}
}
init();
delegateBoxDrag($("#main"), 'mousedown', 'box', startDrag);











