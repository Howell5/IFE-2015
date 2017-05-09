// 避免污染全局变量
(function (){
'use strict';

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
		var getObjByKey = function (obj, key, val) {
			var objArr = [];
			for (var i = 0; i < obj.length; i++) {
				if (obj[i][key] === val) {
					objArr.push(obj[i]);	
				}
			}
			return objArr;
		};
		var getIndexByKey = function (obj, key, val) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i][key] === val) {
					return i;
				}
			}
		}
		return {
			Jsonps: Jsonps,
			getObjByKey: getObjByKey,
			getIndexByKey: getIndexByKey,
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
		content_left_1: $('#content-left-1'),
		content_left_2: $('#content-left-2'),
		all_type: $('.all-type'),
		all_item: $('.all-type').firstElementChild,
		task_list: $('.task-list'),
		items_list: $('.items-list'),
		name_lists: $('.items-list').getElementsByTagName('li')
	}
	var Win = window,
		Doc = document,
		cate,
		cateChild,
		task;

//  使用localStorage + JSON存储任务数据
//  其中cate 表示主分类列表，cateChild 表示子分类列表，task 表示任务详细数据
	var cateText = [
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
	var cateChildText = [
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
	var taskText = [
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


	var html = '',
		optionHtml = '',
		nonnum;

	function renderBase () {
		var cFlag,
			demit,
			aChoose,
			taskIdArr;
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
			html = '';
			setNum();
			optionHtml = '<option value="-1">**新增主分类**</option>';
			DOM.all_type.innerHTML = '<li class="all-items choose"><span>所有任务('+ task.length +')</span></li>'
			for (var i = 0, len = cate.length; i < len; i++) {
				html += '<div class="item-list">'
						+	'<li class="list-name" data-type="main-list" data-id="'+i+'">'
						+	'<i class="icon-folder-open"></i>'
						+	'<span>'+cate[i].name+'</span>'
						+	'<span>('+cate[i].num+')</span>';

						if (i !== 0) {
							html += '<i class="icon-remove"></i>';
						}
								
						html +=	'</li><ul>';
				if (i < len - 1) {
					optionHtml += '<option value="'+ cate[i+1].id +'">' + cate[i+1].name + '</option>';
				}
				for (var j = 0; j < cate[i].childArr.length; j++) {
					var cateChildId = Util.getIndexByKey(cateChild, 'id', cate[i].childArr[j]);
					html += '<li class="child-name"  data-type="child-list" data-id="'+cateChildId+'"><i class="icon-file"></i><span>'+cateChild[cateChildId].name+'</span><span>('+ cateChild[cateChildId].childArr.length +')</span>';
					if (i !== 0 || j !== 0) {
						html += '<i class="icon-remove"></i></li>';
					}
				}
				html += '</ul></div>';
			}

			DOM.items_list.innerHTML = html;
			DOM.list_sel.innerHTML = optionHtml;

			//获取主类里 task 的总个数
			function setNum () {
				var num;
				for (var i = 0; i < cate.length; i++) {
					num = 0;
					for (var j = 0; j < cate[i].childArr.length; j++) {
						var cateChildId = Util.getIndexByKey(cateChild, 'id', cate[i].childArr[j]);
						num += cateChild[cateChildId].childArr.length;
					}
					cate[i].num = num;
				}
			}
		}

		//生成任务二层信息列表
		var makeTask = function (choose,flag) {
			taskIdArr = getTaskIdArr(choose,flag);
			makeTaskById(taskIdArr);
			statusHandle(1);
			return (function (){
				cFlag = flag;
				aChoose = choose;
			})();
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

			function isFinished (obj) {
				if (obj.finish) {
					mesHtml += '<li data-type="task-list"><i class="icon-ok"></i>'+obj.name+'<i class="icon-remove"></i></li>';
				} else {
					mesHtml += '<li data-type="task-list">'+obj.name+'<i class="icon-remove"></i></li>';
				}
			}
			mesHtml += '</ul>';
				
			DOM.task_message.innerHTML = mesHtml;
			function sortDate (arr) {
				return arr.sort(function (a, b) {
					return a.replace(/-/g, '') - b.replace(/-/g, '');
				});
			};
			var firstLi = DOM.task_message.getElementsByTagName('li')[0];
<<<<<<< HEAD
			firstLi && makeTaskDetail(firstLi);
			
=======
			if (firstLi) {
				makeTaskDetail(firstLi);
			}
>>>>>>> 488473fa2a4fa707d90ef00110a1de847703f9f7
		}
		

		//渲染任务详细信息
		var makeTaskDetail = function (taskli) {
			var taskName = taskli.innerText;
			var taskObj = Util.getObjByKey(task, 'name', taskName)[0];
			DOM.todo_name.innerText = taskObj.name;
			DOM.todo_date.innerText = taskObj.date;
			DOM.todo_content.innerText = taskObj.content;

			hide(DOM.bottom_button);
			show(DOM.check_edit);
			return (function() {
				demit = taskli;
			})();
		}

		//页面内容修改编辑模式
		var taskEdit = function () {
			hide(DOM.check_edit);
			show(DOM.bottom_button);
			var content = DOM.todo_content.innerText;
			var contentHTML = '<textarea name="text-content" class="textarea-content">'+ content +'</textarea>';
			
			DOM.todo_content.innerHTML = contentHTML;
			DOM.todo_date.innerHTML = '<input placeholder="例:2017-2-15" type="date" name="todo-date" >';
			DOM.todo_name.innerHTML = '<input type="text" name="todo-name" value='+DOM.todo_name.innerText+'>';
				
		}

		//页面新内容编辑模式
		var newTaskEdit = function () {
			demit = undefined;
			hide(DOM.check_edit);
			show(DOM.bottom_button);
			
			DOM.todo_content.innerHTML = '<textarea name="text-content" class="textarea-content"></textarea>';
			DOM.todo_date.innerHTML = '<input placeholder="例:2017-2-15" type="date" name="todo-date" >';
			DOM.todo_name.innerHTML = '<input type="text" name="todo-name" value="">';
				
		}


		//保存页面编辑内容
		var taskSave = function (cTask) {
			var nameInputValue = DOM.todo_name.firstElementChild.value,
				dateInputValue = DOM.todo_date.firstElementChild.value,
				contentInputValue = DOM.todo_content.firstElementChild.value;

			if(!nameInputValue || !dateInputValue || !contentInputValue) {
				alert('填写内容不得为空');
				return;
			} 
			else if (!isDate(dateInputValue)) {
				alert('日期填写错误');
				return;
			}

			//一、保存现有的任务的修改
			if (demit) {
				var activeTask = Util.getObjByKey(task, 'name', demit.innerText)[0];
				activeTask.name = nameInputValue;
				activeTask.date = dateInputValue;
				activeTask.content = contentInputValue;

			} else {  //二、保存新建任务的信息
				cFlag;
				aChoose;
				var fatherid = (function(cflag, achoose) {
					var fatherid;
					var aCate;
					var itemName = achoose.getElementsByTagName('span')[0].innerHTML;
					if (cFlag === 1) { //当选中为所有任务时，添加新任务
						fatherid = cateChild[0].id;
					} else if (cFlag === 2) { //当选中为主分类时，添加新任务
						aCate = Util.getObjByKey(cate, 'name', itemName)[0];
						fatherid = aCate.childArr[0];
						if (!fatherid) {
							alert('请先放弃新建任务，先新建子分类才可新添加任务');
						}
					} else if (cflag === 3) { //当选中为次分类时，添加新任务
						aCate = Util.getObjByKey(cateChild, 'name', itemName)[0];
						fatherid = aCate.id;
					}

					return fatherid;

				})(cFlag, aChoose);
				var newTask = {
					"id": task.length,
					"name": nameInputValue,
					"date": dateInputValue,
					"content": contentInputValue,
					"fatherId": fatherid,
					"finish": false
				}
				task.push(newTask);
				var fatherObj = Util.getObjByKey(cateChild, 'id', newTask.fatherId)[0];
				
				fatherObj.childArr.push(newTask.id);

			}
			saveData();
			makeTask(aChoose, cFlag);
			makeTaskDetail(DOM.task_message.getElementsByTagName('li')[0]);
			init();
			hide(DOM.bottom_button);
			show(DOM.check_edit);
			
		}
		//还原修改前的数据
		var taskQuit = function () {
			if (demit) {
				makeTaskDetail(demit);
			} else {
				init();
			}
			
		}

		//将任务标记为完成
		var taskFinish = function () {
			var activeTask = Util.getObjByKey(task, 'name', demit.innerText)[0];
			if (activeTask.finish) {
				alert('该任务已经是完成状态了');
			} else {
				activeTask.finish = true;
			}
			saveData();
			init();
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
			init();
			hide(DOM.coverWrap);
			listValue = '';
		}

		//删除分类或任务
		var Deleter = function (ele) {
			var con = confirm("删除操作不可逆，确定删除吗？");
			if (!con) {
				return;
			}

			var parentEle = ele.parentElement,
				eleType = parentEle.dataset.type;
				

			switch(eleType) {
				//删除主分类
				case 'main-list':
					var eleId = parseInt(parentEle.dataset.id),
						curCate = Util.getObjByKey(cate, 'id', eleId)[0],
						index = Util.getIndexByKey(cate, 'id', eleId);
					for (var i = 0, len = curCate.childArr.length; i < len; i++) {
						var curCateChild = Util.getObjByKey(cateChild, 'id', curCate.childArr[i])[0],
							childIndex = Util.getIndexByKey(cateChild, 'id', curCate.childArr[i]);
						
						for (var j = 0, clen = curCateChild.childArr.length; j < clen; j++) {
							var taskIndex = Util.getIndexByKey(task, 'id', curCateChild.childArr[j]);
							task.splice(taskIndex, 1);
						}
						cateChild.splice(childIndex, 1);
					}
					cate.splice(index, 1);
					break;
				//删除子分类
				case 'child-list':
					var eleId = parseInt(parentEle.dataset.id),
						curCateChild = Util.getObjByKey(cateChild, 'id', eleId)[0];
					for (var i = 0, len = curCateChild.childArr.length; i < len; i++) {
						var taskIndex = Util.getIndexByKey(task, 'id', curCateChild.childArr[i]);
						task.splice(taskIndex, 1);
					}
					var fatherObj = Util.getObjByKey(cate, 'id', parseInt(curCateChild.fatherId))[0];
					
					fatherObj.childArr.splice(fatherObj.childArr.indexOf(eleId), 1);
					cateChild.splice(eleId, 1);
					break;
				//删除任务
				case 'task-list':
					var eleInnerHTML = ele.parentElement.innerText,
						curTask = Util.getObjByKey(task, 'name', eleInnerHTML)[0],
						fatherObj = Util.getObjByKey(cateChild, 'id', curTask.fatherId)[0],
						taskIndex = Util.getIndexByKey(task, 'id', curTask.id);
					fatherObj.childArr.splice(fatherObj.childArr.indexOf(curTask.id), 1);
					task.splice(taskIndex, 1);
						

					break;
				default:
					throw new Error ("the HTML data-type is wrong!");
					break;
			}
			//debugger;
			saveData();
			init();
			
		}

		var init = function () {
			makeType();
			makeTask(DOM.all_type.firstElementChild, 1);
			makeTaskDetail(DOM.task_message.getElementsByTagName('li')[0]);
			//回收因闭包而未销毁的变量
			demit = null;
			cFlag = null;
			aChoose = null;
		}
		init();
		return {
			init: init,
			Deleter: Deleter,
			addList: addList,
			taskQuit: taskQuit,
			taskSave: taskSave,
			taskEdit: taskEdit,
			taskFinish: taskFinish,
			newTaskEdit: newTaskEdit,
			makeTaskDetail: makeTaskDetail,
			statusHandle: statusHandle,
			makeTask: makeTask
		}
	}

	function EventHandle () {
		var icon_del = document.getElementsByClassName('icon-remove')[0];

		var firstSelBtn = DOM.task_menu.firstElementChild;
		//分类列表点击
		var cateClick = function (callback) {
			delegateEvent(DOM.task_list, 'li', 'click', function(name) {
				for (var i = 0; i < DOM.name_lists.length; i++) {
					removeClass(DOM.name_lists[i], 'choose');
				}
				for (var i = 0; i < DOM.selBtn_lists.length; i++) {
					removeClass(DOM.selBtn_lists[i], 'choose');
				}
				removeClass(DOM.all_type.firstElementChild, 'choose');
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

		//点击任务完成按钮
		var checkClick = function (callback) {
			addClickEvent(DOM.icon_check, function () {
				callback && callback();
			})
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

		//点击新增任务按钮
		var addTaskClick = function (callback) {
			addClickEvent(DOM.item_bottom_b, function () {
				callback && callback();
			});
		}
		//点击删除按钮
		var DeleteClick = function (callback) {
			//代理删除分类的按钮
			delegateEvent(DOM.content_left_1, 'icon-remove', 'click', function(ele) {
				callback && callback(ele);
			});
			//代理删除任务的按钮
			delegateEvent(DOM.content_left_2, 'icon-remove', 'click', function(ele) {
				callback && callback(ele);
			});
		}

		return {
			DeleteClick: DeleteClick,
			addTaskClick: addTaskClick,
			checkClick: checkClick,
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
		

	function main () {
		// TODO: 执行入口
		var renderModel = renderBase();
		var eventHandle = EventHandle();
		var flag;
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
			renderModel.makeTaskDetail(taskName);
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
		eventHandle.checkClick(function () {
			renderModel.taskFinish();
		});
		eventHandle.addTaskClick(function () {
			renderModel.newTaskEdit();
		});
		eventHandle.DeleteClick(function (ele) {
			renderModel.Deleter(ele);
		});
	}

	function saveData () {
		Util.StorageSetter('cate', JSON.stringify(cate));
		Util.StorageSetter('cateChild', JSON.stringify(cateChild));
		Util.StorageSetter('task', JSON.stringify(task));
	}


	Win.onload = function () {
		if (!Util.StorageGetter('cate')) {
			Util.StorageSetter('cate', JSON.stringify(cateText));
			Util.StorageSetter('cateChild', JSON.stringify(cateChildText));
			Util.StorageSetter('task', JSON.stringify(taskText));
		}
		cate = JSON.parse(Util.StorageGetter('cate')),
		cateChild = JSON.parse(Util.StorageGetter('cateChild')),
		task = JSON.parse(Util.StorageGetter('task'));
		
		main();
	}
	
	
})();