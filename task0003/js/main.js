// 避免污染全局变量
'use strict';
(function (){
	//封装常用方法
	var Util = (function () {
		var prex = 'TASK_MANAGER_';
		var StorageGetter = function (key) {
			return localStorage.getItem(prex + key);
		};
		var StorageSetter = function (key, val) {
			return localStorage.setItem(prex + key, val);
		};
		var Jsonps = function (key) {
			return JSON.parse(JSON.stringify(key));
		};
		var getObjByKey = function(obj, key, val) {
			var objArr = [];
			for (var i = 0; i < obj.length; i++) {
				if (obj[i][key] === val) {
					objArr.push(obj[i]);	
				}
			}
			return objArr;
		}
		return {
			Jsonps: Jsonps,
			getObjByKey: getObjByKey,
			StorageGetter: StorageGetter,
			StorageSetter: StorageSetter
		}
	})();

	var DOM = {
		list_val: $('.list-val'),
		list_sel: $('.list-sel'),
		btn_add_quit: $('.modal-foot .btn-add-quit'),
		btn_add_ok: $('.modal-foot .btn-add-ok'),
		item_bottom_a: $('#content-left-1 .item-bottom'),
		item_bottom_b: $('#content-left-2 .item-bottom'),
		coverWrap: $('.cover'),
		btn_save: $('.bottom-area .btn-save'),
		btn_quit: $('.bottom-area .btn-quit'),
		icon_check: $('.check-edit .icon-check'),
		icon_edit: $('.check-edit .icon-edit'),
		bottom_button: $('.bottom-area .bottom-button'),
		check_edit: $('.task-title .check-edit'),
		todo_name: $('.task-title .todo-name'),
		todo_date: $('.select-date .todo-date'),
		todo_content: $('.task-content .content'),
		task_menu: $('.task-menu'),
		selBtn_lists: $('.task-menu').getElementsByTagName('li'),
		task_message: $('.task-message'),
		all_type: $('.all-type'),
		task_list: $('.task-list'),
		items_list: $('.items-list'),
		name_lists: $('.items-list').getElementsByTagName('li')
	}
	var Win = window,
		Doc = document;

//  使用localStorage + JSON存储任务数据
//  其中cate 表示主分类列表，cateChild 表示子分类列表，task 表示任务详细数据
	var cate = [
		{
			"id": 0,
			"childArr": [0],
			"name": "默认分类"
		},
		{
			"id": 1,
			"childArr": [1,2],
			"name": "百度前端学院"
		}
	];
	var cateChild = [
		{
			"id": 0,
			"name": "默认子分类",
			"childArr": [0],
			"fatherId": 0
		},
		{
			"id": 1,
			"name": "任务一",
			"childArr": [1,2],
			"fatherId": 1
		},
		{
			"id": 2,
			"name": "任务二",
			"childArr": [3],
			"fatherId": 1
		}
	];
	var task = [
		{
			"id": 0,
			"name": "sad-0",
			"date": "2017-3-15",
			"content": "这是默认的第一个任务",
			"fatherId": 0,
			"finish": true
		},
		{
			"id": 1,
			"name": "sad-1",
			"date": "2017-3-17",
			"content": "熟悉html,css",
			"fatherId": 1,
			"finish": true

		},
		{
			"id": 2,
			"name": "sad-2",
			"date": "2017-3-17",
			"content": "熟悉html5,css3,JavaScirpt",
			"fatherId": 1,
			"finish": true
		},
		{
			"id": 3,
			"name": "sad-3",
			"date": "2017-3-18",
			"content": "熟悉Vue.js框架,Node.JS服务器",
			"fatherId": 2,
			"finish": false

		}
	];


	var html = '';
	function todo () {
		// TODO: 任务编辑操作
	}

	function renderBase () {
		var taskIdArr;
		// 获得 taskIdArr 方法
		var getTaskIdArr = function (choose,flag) {
			var taskIdArr = [];
			var itemName = choose.getElementsByTagName('span')[0].innerHTML;
			switch (flag) {
				case 1:    //选中所有任务
					for (var i = 0; i < task.length; i++) {
						taskIdArr.push(task[i].id);
					}
					return taskIdArr;
					break;
				case 2:    //选中主分类
					var cateObj = Util.getObjByKey(cate, 'name', itemName)[0];
					for (var i = 0; i < cateObj.childArr.length; i++) {
						var childObj = Util.getObjByKey(cateChild, 'id', cateObj.childArr[i])[0];
						for (var j = 0; j < childObj.childArr.length; j++) {
							taskIdArr.push(childObj.childArr[j]);
						}
					}
					return taskIdArr;
					break;
				case 3:    //选中子分类
					var childObj = Util.getObjByKey(cateChild, 'name', itemName)[0];
					for (var i = 0; i < childObj.childArr.length; i++) {
						taskIdArr.push(childObj.childArr[i]);
					}
					return taskIdArr;
					break;
			};
		}

		// 渲染任务分类列表
		var makeType = function () {
			DOM.all_type.innerHTML = '<li class="all-items choose"><span>所有任务('+ task.length +')</span></li>'
			for (var i = 0; i < cate.length; i++) {
				html += '<div class="item-list">'
						+	'<li class="list-name">'
						+	'<i class="icon-folder-open"></i>'
						+	'<span>'+cate[i].name+'</span>'
						+	'<span>'+'nonnum'+'</span>'
						+		'<i class="icon-remove"></i>'
						+	'</li>'
						+	'<ul>';
				for (var j = 0; j < cate[i].childArr.length; j++) {
					var cateChildId = cate[i].childArr[j];
					html += '<li class="child-name"><i class="icon-file"></i><span>'+cateChild[cateChildId].name+'</span><span>('+ cateChild[cateChildId].childArr.length +')</span><i class="icon-remove"></i></li>'
				}
				html += '</ul></div>';
			}

			DOM.items_list.innerHTML = html;
		}

		//生成任务二层信息列表
		var makeTask = function (choose,flag) {
			taskIdArr = getTaskIdArr(choose,flag);
			makeTaskById(taskIdArr);
			statusHandle(1);
			/*var taskIdArr = [];
			var itemName = choose.getElementsByTagName('span')[0].innerHTML;
			switch (flag) {
				case 1:    //选中所有任务
					for (var i = 0; i < task.length; i++) {
						taskIdArr.push(task[i].id);
					}
					makeTaskById(taskIdArr);
					break;
				case 2:    //选中主分类
					var cateObj = Util.getObjByKey(cate, 'name', itemName);
					for (var i = 0; i < cateObj.childArr.length; i++) {
						var childObj = Util.getObjByKey(cateChild, 'id', cateObj.childArr[i]);
						for (var j = 0; j < childObj.childArr.length; j++) {
							taskIdArr.push(childObj.childArr[j]);
						}
					}
					makeTaskById(taskIdArr);
					break;
				case 3:    //选中子分类
					var childObj = Util.getObjByKey(cateChild, 'name', itemName);
					for (var i = 0; i < childObj.childArr.length; i++) {
						taskIdArr.push(childObj.childArr[i]);
					}
					makeTaskById(taskIdArr);
			};*/
			
			
		}

		//渲染筛选菜单
		var statusHandle = function (flag) {
			var finishIdArr = [];
			var unfinishIdArr = [];
			var taskArr = [];
			for (var i = 0; i < taskIdArr.length; i++) {
				var taskChoose = Util.getObjByKey(task, 'id', taskIdArr[i])[0];
				taskArr.push(taskChoose);
			}
			for (var i = 0; i < taskArr.length; i++) {
				if (taskArr[i].finish) {
					finishIdArr.push(taskArr[i].id);
				} else {
					unfinishIdArr.push(taskArr[i].id);
				}
			}
			switch(flag) {
				case 1:
					makeTaskById(taskIdArr);
					break;
				case 2:
					makeTaskById(finishIdArr);
					break;
				case 3:
					makeTaskById(unfinishIdArr);
					break;
			}
			
		}

		// 渲染二层任务信息列表
		var makeTaskById = function (taskIdArr) {
			var date = [];
			var taskDate;
			for (var i = 0; i < taskIdArr.length; i++) {
				taskDate = Util.getObjByKey(task, 'id', taskIdArr[i])[0].date;
				date.push(taskDate);
			}
			date = uniqArray(date);  //去重
			date = sortDate(date);	 //排序

			var mesHtml = '';
			for (var i = 0; i < date.length; i++) {
				mesHtml += '<div class="task-date">'+ date[i] +'</div><ul>';
				var taskObjSameDate = Util.getObjByKey(task, 'date', date[i]); //获取拥有相同日期的task

				for (var j = 0; j < taskObjSameDate.length; j++) {
					isFinished(taskObjSameDate[j]);
				}
			}

			//生成li标签函数
			// var renderLi = function (date)

			function isFinished (obj) {
				if (obj.finish) {
					mesHtml += '<li><i class="icon-ok"></i>'+obj.name+'<i class="icon-remove"></i></li>';
				} else {
					mesHtml += '<li>'+obj.name+'<i class="icon-remove"></i></li>';
				}
			}
			mesHtml += '</ul>';
				
			DOM.task_message.innerHTML = mesHtml;
			function sortDate (arr) {
				return arr.sort(function (a, b) {
					return a.replace(/-/g, '') - b.replace(/-/g, '');
				});
			};
			
		}
		var demit;
		//渲染任务详细信息
		var makeTaskDetail = function (taskli) {
			var taskName = taskli.innerText;
			var taskObj = Util.getObjByKey(task, 'name', taskName)[0];
			DOM.todo_name.innerText = taskObj.name;
			DOM.todo_date.innerText = taskObj.date;
			DOM.todo_content.innerText = taskObj.content;
			return function() {
				demit = taskli;
			};
			

			
		}

		//页面内容编辑模式
		var taskEdit = function () {
			hide(DOM.check_edit);
			show(DOM.bottom_button);
			var content = DOM.todo_content.innerText;
			var contentHTML = '<textarea name="text-content" class="textarea-content">'+ content +'</textarea>';
			DOM.todo_content.innerHTML = contentHTML;
			DOM.todo_date.innerHTML = '<input placeholder="例:2017-2-15" type="date" name="todo-date" >';
			DOM.todo_name.innerHTML = '<input type="text" name="todo-name" value='+DOM.todo_name.innerText+'>';	
		}

		//保存页面编辑内容
		var taskSave = function () {
			var nameInputValue = DOM.todo_name.firstElementChild.value,
				dateInputValue = DOM.todo_date.firstElementChild.value,
				contentInputValue = DOM.todo_content.firstElementChild.value;

			
			if (nameInputValue != '' && isDate(dateInputValue) && contentInputValue != '') {
				DOM.todo_name.innerText = nameInputValue;
				DOM.todo_date.innerText = dateInputValue;
				DOM.todo_content.innerText = contentInputValue;

				hide(DOM.bottom_button);
				show(DOM.check_edit);
			} else {
				alert('请填写正确的内容格式！');
			}
			
		}

		//还原修改前的数据
		var taskQuit = function () {
			makeTaskDetail(demit)();
		}
		
		//新增主分类
		var addList = function () {
			var selValue = DOM.list_sel;
			var index = selValue.value;
			var listValue = DOM.list_val.value;
			if (listValue === '') {
				throw new Error('新分类名称不准为空！');
				alert('新分类名称不准为空！');
			} else if (index === '-1') { //新增主分类
				var newCate = {
					"id": cate[cate.length-1].id + 1,
					"childArr": [],
					"name": listValue
				};
				cate.push(newCate);
				saveData();

			} else {
				var newcateChild = {
					"id": cateChild[cateChild.length-1].id + 1,
					"name": listValue,
					"childArr": [],
					"fatherId": index
				}
				cate[index].childArr.push(newcateChild.id);
				cateChild.push(newcateChild);
				saveData();
			}
			makeType();
			hide(DOM.coverWrap);

		}

		return {
			addList: addList,
			taskQuit: taskQuit,
			taskSave: taskSave,
			taskEdit: taskEdit,
			makeTaskDetail: makeTaskDetail,
			statusHandle: statusHandle,
			makeType: makeType,
			makeTask: makeTask
		}
	}

	function EventHandle () {
		//TODO: 页面交互效果
		
		//按钮hover效果
		/*function listHover () {
			delegateEvent(DOM.items_list, 'li', 'mouseover', function(name) {
				hideToggle(name);
			});
			delegateEvent(DOM.items_list, 'li', 'mouseout', function(name) {
				hideToggle(name);
			});
		}
		listHover();*/
		var firstSelBtn = DOM.task_menu.firstElementChild;
		//分类列表点击
		var cateClick = function (callback) {
			var all_items = DOM.all_type.firstElementChild;
			delegateEvent(DOM.task_list, 'li', 'click', function(name) {
				for (var i = 0; i < DOM.name_lists.length; i++) {
					removeClass(DOM.name_lists[i], 'choose');
				}
				for (var i = 0; i < DOM.selBtn_lists.length; i++) {
					removeClass(DOM.selBtn_lists[i], 'choose');
				}
				removeClass(all_items, 'choose');
				addClass(name, 'choose');
				addClass(firstSelBtn, 'choose');
				callback && callback(name);
				
			});
		}

		//筛选菜单点击
		var selClick = function (callback) {
			delegateEvent(DOM.task_menu, 'li', 'click', function(selBtn) {
				for (var i = 0; i < DOM.selBtn_lists.length; i++) {
					removeClass(DOM.selBtn_lists[i], 'choose');
				}
				addClass(selBtn, 'choose');
				callback && callback(selBtn);
			});
		}

		//二层任务名点击
		var taskNameClick = function (callback) {
			delegateEvent(DOM.task_message, 'li', 'click', function(taskName) {
				callback && callback(taskName);
			});
		}

		//点击编辑按钮
		var editClick = function (callback) {
			addClickEvent(DOM.icon_edit, function () {
				callback && callback();
			});
		}
		//点击保存按钮
		var contentSaveClick = function (callback) {
			addClickEvent(DOM.btn_save, function () {
				callback && callback();
			});
		}
		//点击取消按钮
		var contentQuitClick = function (callback) {
			addClickEvent(DOM.btn_quit, function () {
				callback && callback();
				hide(DOM.bottom_button);
				show(DOM.check_edit);
			});
		}
		//点击新增主分类按钮
		var addListClick = function (callback) {
			addClickEvent(DOM.item_bottom_a, function () {
				show(DOM.coverWrap);
			});
		}
		//点击新增分类的取消按钮
		var quitAddList = function () {
			addClickEvent(DOM.btn_add_quit, function () {
				hide(DOM.coverWrap);
			});
		}
		//点击新增分类的确认按钮
		var sureAddList = function (callback) {
			addClickEvent(DOM.btn_add_ok, function () {
				callback && callback();
			});
		}

		return {
			sureAddList: sureAddList,
			quitAddList: quitAddList,
			addListClick: addListClick,
			contentQuitClick: contentQuitClick,
			contentSaveClick: contentSaveClick,
			editClick: editClick,
			taskNameClick: taskNameClick,
			selClick: selClick,
			cateClick: cateClick
		}



	}

	//保存数据
	function saveData () {
		Util.StorageSetter('cate', JSON.stringify(cate));
		Util.StorageSetter('cateChild', JSON.stringify(cateChild));
		Util.StorageSetter('task', JSON.stringify(task));
	}		

	function main () {
		saveData();
		// TODO: 执行入口
		var renderModel = renderBase();
		var eventHandle = EventHandle();
		var flag;
		renderModel.makeType();
		eventHandle.cateClick(function(name) {
			if (name.className.indexOf('all-items') !==-1) {
				//选中所有任务
				flag = 1;
				renderModel.makeTask(name,flag);
			} else if (name.className.indexOf('list-name') !==-1) {
				//选中主分类
				flag = 2;
				renderModel.makeTask(name,flag);
			} else if (name.className.indexOf('child-name') !==-1 ) {
				//选中子分类
				flag = 3;
				renderModel.makeTask(name,flag);
			}
		});
		eventHandle.selClick(function(selBtn) {
			if (selBtn.innerHTML.indexOf('所有') !==-1) {
				//选中所有任务
				flag = 1;
				renderModel.statusHandle(flag);
			} else if (selBtn.innerHTML.indexOf('已完成') !==-1) {
				//选中完成
				flag = 2;
				renderModel.statusHandle(flag);
			} else if (selBtn.innerHTML.indexOf('未完成') !==-1 ) {
				//选中未完成
				flag = 3;
				renderModel.statusHandle(flag);
			}
		});
		eventHandle.taskNameClick(function(taskName) {
			renderModel.makeTaskDetail(taskName)();
		});
		eventHandle.editClick(function() {
			renderModel.taskEdit();
		});
		eventHandle.contentSaveClick(function() {
			renderModel.taskSave();
		});
		eventHandle.contentQuitClick(function() {
			renderModel.taskQuit();
		});
		eventHandle.addListClick();
		eventHandle.quitAddList();
		eventHandle.sureAddList(function () {
			renderModel.addList();
		});
	}
	win.onload = function () {
		var cate = JSON.parse(Util.StorageGetter('cate')),
			cateChild = JSON.parse(Util.StorageGetter('cateChild')),
			task = JSON.parse(Util.StorageGetter('task'));
	}
	
	main();
})();