/**
 * 轮播图组件
 * @param {HTMLELement}   element HTML节点图片容器
 * @param {JSON}          option  配置项
 *   @config   {Bool}       noLoop         不循环？，默认为循环，noLoop值为false则不循环。
 *   @config   {Bool}       reverse        是否反向，只有“noLoop”不存在时，也就是只有循环时，才执行。
 *   @config   {Number}       intervalTime   轮播间隔时间（单位为秒），默认为4秒，
 */

slideShow($('.img-container'),{
	noLoop : false,
	intervalTime : 2
});

function slideShow(element, option) {
	// 1.创建li
	var imgArr = element.getElementsByTagName('img'),
		iCurrent = parseInt(getStyle(imgArr[0], "width")),
		imgLen = imgArr.length,
		createUl = document.createElement("ul"),
		createLR = document.createElement('div'),
		timer = null,
		iSpeed;

	if (option.intervalTime) {
		iSpeed = option.intervalTime * 1000;
	} else {
		iSpeed = 4000;
	}
	element.style.width = iCurrent * imgLen + "px";

	//2.创建li
	for (var i = 0, len = imgLen; i < len; i++) {
		createUl.innerHTML += "<li></li>";
	}
	var liCol = createUl.getElementsByTagName('li'),
		liColLen = liCol.length;

	element.parentNode.appendChild(createUl);
	addClass(createUl, "slideshow-nav");
	addClass(createUl.firstChild, "active");

	createLR.innerHTML = "<span class='nav-left'>&lt;</span><span class='nav-right'>&gt;</span>";
	element.parentNode.appendChild(createLR);
	addClass(createLR, "left-right");


	//执行操作
	timer = setInterval(autoPlay, iSpeed);
	clickLi();
	hoverElement();

	clickSpan();



	//自动播放
	function autoPlay() {
		var iTarget;
		var selectLi = $(".slideshow-nav .active");
		if (option.noLoop) {
			iTarget = (-iCurrent * (getIndex(selectLi) + 1));
			if ((getIndex(selectLi) + 1) === liColLen - 1) {
				clearInterval(timer);
			}
			var nextLi = selectLi.nextSibling;
			removeLiClass();
			if (nextLi) {	
				addClass(nextLi, "active");		
			}
			startMove(element,{
				left : iTarget
			});
		} else {
			if (option.reverse) {
				play(false);
			} else {
				play(true);
			}
		}		
		
	}
	function clickSpan() {
		var navLeft = $(".left-right .nav-left"),
			navRight = $(".left-right .nav-right");
		addEvent(navLeft, "click", function(){
			play(false);
		});
		addEvent(navRight, "click", function(){
			play(true);
		});
	}

	// 点击左右箭头及循环时触发
	function play(bool) {
		var iTarget;
		var selectLi = $(".slideshow-nav .active");
		if (bool) {
			iTarget = (getIndex(selectLi) + 1) === liColLen ? 0 : (-iCurrent * (getIndex(selectLi) + 1)); 
			var nextLi = selectLi.nextSibling;
			removeLiClass();
			if (nextLi) {
				addClass(nextLi, "active");	
			} else {
				addClass(liCol[0], "active");
			}
			startMove(element, {
				left : iTarget
			});
		} else {
			iTarget = getIndex(selectLi) === 0 ? (-iCurrent * (imgLen-1)) : (-iCurrent * (getIndex(selectLi) - 1));
			var previousLi = selectLi.previousSibling;
			removeLiClass();		
			if (previousLi) {
				addClass(previousLi, "active");	
			} else {
				addClass(liCol[liCol.length - 1], "active");
			}
			startMove(element, {
				left : iTarget
			});
		}
	}	

	//鼠标移入移出的停止与触发
	function hoverElement() {
		addEvent(element.parentNode, "mouseover", function (){
			clearInterval(timer);
		});
		addEvent(element.parentNode, "mouseout", function (){
			timer = setInterval(autoPlay, iSpeed);
		});
	}

	//点击播放
	function clickLi() {
		delegateEvent(createUl, "li", "click", function(ali){
			var iTarget = -iCurrent * getIndex(ali);
			removeLiClass();
			addClass(ali, "active");
			startMove(element, {
				left : iTarget
			});
		});	
	}
	
	//移除所有li的className
	function removeLiClass() {
		for (var i = 0, len = liCol.length; i < len; i++) {
			if (liCol[i].className !== "") {
				removeClass(liCol[i], "active");
			}
			
		}
	}
	function getIndex(li) {
		var liArr = Array.prototype.slice.call(liCol);
		return liArr.indexOf(li);
	}
}

