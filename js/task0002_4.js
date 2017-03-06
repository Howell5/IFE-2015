window.onload = winLoad;

function winLoad() {
    var eInput = $(".text-input"),
        adviceUl = $(".advice-ul"),
        adviceLis = adviceUl.getElementsByTagName('li');

    // addClass(adviceLis[0], "active");

    inputChange();
    clickLi();
    focusInput();

    //监测input内值的变化
    function inputChange() {
        if (eInput.addEventListener) {
            eInput.addEventListener('input', function(ev) {
                var changedValue = ev.target.value;
                handleValue(changedValue);
            }, false);
        } else if (eInput.attachEvent) {
            eInput.attachEvent("OnPropChanged", function(ev) {
                if (event.propertyName.toLowerCase() === "value") {
                    var changedValue = event.srcElement.value;
                    handleValue(changedValue);
                }
            });
        }
    }

    //处理输入值
    function handleValue(value) {
        if (value === "") {
            adviceUl.style.display = "none";
        } else {
            ajax("task0002_4.txt", {
                onsuccess: prompt
            });
        }

        //onsuccess处理函数，将匹配成功的值，转化为列表显示出来
        function prompt(data) {
            var suggestData = data.split(','),
                pattern = new RegExp("^" + value, "i"), //获取开头相同的字符串
                liString = "";

            for (var i = 0, len = suggestData.length; i < len; i++) {
                if (suggestData[i].match(pattern)) {
                    liString += "<li><span>" + value + "</span>" + suggestData[i].substr(value.length) + "</li>";
                }
            }
            adviceUl.innerHTML = liString;
            adviceUl.style.display = "block";
        }
    }

    function clickLi() {
        delegateEvent(adviceUl, "li", "mouseover", function() {
            removeLiClass();
            addClass(this, "active");
        });
        delegateEvent(adviceUl, "li", "mouseout", function() {
            removeClass(this, "active");
        });
        delegateEvent(adviceUl, "li", "click", function() {
            eInput.value = delegateSpan(this.innerHTML);
            adviceUl.style.display = "none";
        });
    }

    function focusInput() {
        // 聚焦在输入框时触发 键盘事件 。

        addEvent(eInput, "focus", function() {
            addEvent(eInput, "keydown", function(ev) {
                var activeLi = $(".advice-ul .active"),
                    len = adviceLis.length;

                switch (ev.key) {
                    case "ArrowDown":
                        if (activeLi) {
                            var nextLi = activeLi.nextElementSibling;
                            if (nextLi) {
                                removeLiClass();
                                addClass(nextLi, "active");
                            } else {
                                removeLiClass();
                                addClass(adviceLis[0], "active");
                            }
                        } else {
                            addClass(adviceLis[0], "active");
                        }

                        break;
                    case "ArrowUp":
                        if (activeLi) {
                            var previousLi = activeLi.previousElementSibling;
                            if (previousLi) {
                                removeLiClass();
                                addClass(previousLi, "active");
                            } else {
                                removeLiClass();
                                addClass(adviceLis[len - 1], "active");
                            }
                        } else {
                            addClass(adviceLis[len - 1], "active");
                        }

                        break;
                    case "Enter":
                        eInput.value = delegateSpan(activeLi.innerHTML);
                        adviceUl.style.display = "none";
                        break;
                    default:
                        return;
                }
            });

        });
    }

    /*	//计算上一个或下一个li
    	function ArrowLi(bool) {
    		//存在activeLi时
    		if (activeLi) {
    			//当bool为true时表示ArrowUp
    			if(bool){
    				var previousLi = activeLi.previousElementSibling;
    			} else { //当bool为false时表示ArrowDown
    				var nextLi = activeLi.nextElementSibling;
    			}
    		} else { // 不存在activeLi时
    			if (bool) {
    				var previousLi = adviceUl.lastChild;
    			} else {
    				var nextLi = adviceUl.firstChild;
    			}
    		}
    	}*/

    //消除li里span样式
    function delegateSpan(stringHTML) {
        var pattern = /^<span>(\w+)<\/span>(\w+)$/;
        var stringArr = stringHTML.match(pattern);
        return stringArr[1] + stringArr[2];
    }


    //清除所有li的active状态
    function removeLiClass() {
        for (var i = 0, len = adviceLis.length; i < len; i++) {
            adviceLis[i].className = "";
        }
    }
}
