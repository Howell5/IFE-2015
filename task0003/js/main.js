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
			for (var i = 0; i < obj.length; i++) {
				if (obj[i][key] === value) {
					return obj[i];
				}
			}
		}
		return {
			Jsonps: Jsonps,
			StorageGetter: StorageGetter,
			StorageSetter: StorageSetter
		}
	})();

	var DOM = {
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
			"date": "2017-3-16",
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

	var josnCate = Util.Jsonps(cate),
		jsonCateChild = Util.Jsonps(cateChild),
		jsonTask = Util.Jsonps(task);

	var html = '';
	function todo () {
		// TODO: 任务编辑操作
	}

	function renderBase () {
		// 生成任务分类列表
		var makeType = function () {
			DOM.all_type.innerHTML = '<li class="all-items choose"><span>所有任务('+ jsonTask.length +')</span></li>'
			for (var i = 0; i < josnCate.length; i++) {
				html += '<div class="item-list">'
						+	'<li class="list-name">'
						+	'<i class="icon-folder-open"></i>'
						+	'<span>'+josnCate[i].name+'</span>'
						+	'<span>'+'nonnum'+'</span>'
						+		'<i class="icon-remove"></i>'
						+	'</li>'
						+	'<ul>';
				for (var j = 0; j < josnCate[i].childArr.length; j++) {
					var cateChildId = josnCate[i].childArr[j];
					html += '<li class="child-name"><i class="icon-file"></i><span>'+jsonCateChild[cateChildId].name+'</span><span>('+ jsonCateChild[j].childArr.length+')</span><i class="icon-remove"></i></li>'
				}
				html += '</ul></div>';
			}

			DOM.items_list.innerHTML = html;
		}

		//生成任务二层信息列表
		var makeTask = function (choose,flag) {
			var date = [];
			var itemName = choose.getElementsByTagName('span')[0].innerHTML;
			switch (flag) {
				case 1:    //选中所有任务
					for (var i = 0; i < jsonTask.length; i++) {
						date.push(jsonTask[i][id]);
					}
					makeTaskById();
					break;
				case 2:    //选中主分类
					var cateObj = Util.getObjByKey(cate, 'name', itemName);
					for (var i = 0; i < cateObj.length; i++) {
						cateObj[i]
					}
				case 3:    //选中子分类
			};
			console.log('its all on me ',flag,itemName);
		}
		var makeTaskById = function (taskIdArr) {

		}

		return {
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

		//分类列表点击效果
		var cateClick = function (callback) {
			var all_items = DOM.all_type.firstElementChild;
			delegateEvent(DOM.task_list, 'li', 'click', function(name) {
				for (var i = 0; i < DOM.name_lists.length; i++) {
					removeClass(DOM.name_lists[i], 'choose');
				}
				removeClass(all_items, 'choose');
				addClass(name, 'choose');
				callback && callback(name);
				
			});
		}
		return {
			cateClick: cateClick
		}

	}

	function main () {
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
		})
		
	}

	main();
})();
