(function(window, document){
	/**
	 * date的周次偏移offset之后所在周的第一天，offset为0或者不传值表示当前周
	 * @param date
	 * @param offset
	 * @returns {Date}
	 */
	function firstDayOfWeek(date, offset){
		offset = offset || 0;
		date = clearTime(date);
		var day = date.getDay();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset * 7 - day);
	}
	/**
	 * date的月份偏移offset之后所在月的第一天。如果需要返回date所在月份，则offset可以不传值。
	 * @param date
	 * @param offset
	 * @returns {Date}
	 */
	function firstDayOfMonth(date, offset){
		offset = offset || 0;
		date = clearTime(date);
		var month = date.getMonth(),  // 6
			year = date.getFullYear();  //2016
		var margin = month + offset;  //11
		var newMonth = (12 + margin % 12) % 12;  // 0
		var yearAdded = Math.floor(margin / 12);

		return new Date(year + yearAdded, newMonth, 1);
	}
	/**
	 * 清除时间，即返回当前日期的凌晨的时间
	 * @param date
	 * @returns {Date}
	 */
	function clearTime(date){
		return new Date(date.setHours(0,0,0,0));
	}
	/**
	 * 判断两个date是否相同，注意不比较时间，只比较日期
	 * @param date1
	 * @param date2
	 * @returns {boolean}
	 */
	function isSameDate(date1, date2){
		return date1.getFullYear() == date2.getFullYear()
			&& date1.getMonth() == date2.getMonth()
			&& date1.getDate() == date2.getDate();
	}

	function rsqChk(fun, p){
		if(typeof fun == 'function'){
			fun.apply(null, p);
		}
	}
	function newElement(params){
		params = params || {};
		var tag = params.tag || 'div';
		var ele = document.createElement(tag);
		if(params.class){ele.className = params.class}
		if(params.id){ele.setAttribute('id', params.id)}
		if(params.inner){ele.innerHTML = params.inner}
		return ele;
	}
	function toggleSub(){
		var menu = document.querySelector('.frm-option-sub');
		menu.classList.toggle('is-hidden');
	}
	function setMainButton(btn, cb){
		var newBtn = newElement({'class': 'frm-option-main', inner: btn.name});
		newBtn.addEventListener('click', function(){
			rsqChk(cb, [btn]);
		});
		eOptionButtons.appendChild(newBtn);
	}
	function setSubButtons(btns, cb){
		var btnList = newElement({tag: 'ul', 'class': 'frm-options-menu-list'});
		btns.forEach(function(btn){
			var ele = newElement({tag: 'li', 'class': 'frm-options-menu', inner: btn.name});
			ele.addEventListener('click', function(){
				rsqChk(cb, [btn]);
				toggleSub();
			});
			btnList.appendChild(ele);
		});
		var subBtn = newElement({'class': 'frm-option-sub is-hidden'});
		subBtn.appendChild(btnList);
		eOptionButtons.appendChild(subBtn);
	}

	function pickerItemSelect(className, isSingleSelect, parentDom){
		//  如果是单选，则先取消已选中的元素
		if(isSingleSelect){
			var oldSel = parentDom.querySelector('.' + className);
			if(oldSel){
				oldSel.classList.remove(className);
			}
		}
		this.classList.add(className);
	}
	function renderPickerList(items, defaultVal){
		var itemList = newElement({tag: 'ul', 'class': 'frm-picker-list'});
		items.forEach(function(item, index){
			var ele = newElement({tag: 'li', 'class': 'frm-picker-item icon-asdf', inner: item.name, id: 'frmPicker-' + index});
			if(item.value == defaultVal){
				ele.classList.add('frm-picker-item--checked');
			}
			itemList.appendChild(ele);
		});
		return itemList;
	}
	function bindPickerListEvent(lay){
		var itemList = lay.querySelectorAll('.frm-picker-item');
		for (var item of itemList) {
			item.addEventListener('click', function(){
				pickerItemSelect.call(this, 'frm-picker-item--checked', true, lay);
			});
		}

	}

	/**
	 * 获取月份面板的html代码
	 * @param focusDate
	 * @returns {string}
	 */
	function getMonthHTML(parent, focusDate){
		var selectDate = getSelectDate(parent);
		var thisDate = firstDayOfWeek(firstDayOfMonth(focusDate));
		var year = thisDate.getFullYear(),
			month = thisDate.getMonth(),
			date = thisDate.getDate();
		var str = '';
		for(var i = 0; i < 6; i ++){
			str += '<tr>';
			for(var j = 0; j < 7; j++){
				thisDate = new Date(year, month, date + i * 7 + j);
				var greyClass = thisDate.getMonth() == focusDate.getMonth() ? '' : 'frm-dp-grey';
				var selClass = isSameDate(selectDate, thisDate) ? 'frm-dp-selected' : '';
				str += '<td><div class="frm-dp-day ' + greyClass + ' ' + selClass + '" data-date="' + thisDate.getTime() + '">' + thisDate.getDate() + '</div></td>';
			}
			str += '</tr>';

			if(i == 4 && new Date(year, month, date + (i + 1) * 7).getMonth() != focusDate.getMonth())
				break;
		}
		return '' +
		'<table class="frm-dp-table">' +
			'<thead><tr><td class="frm-week">日</td><td class="frm-week">一</td><td class="frm-week">二</td><td class="frm-week">三</td><td class="frm-week">四</td><td class="frm-week">五</td><td class="frm-week">六</td></tr></thead>' +
			'<tbody>' + str + '</tbody>' +
			'</table>';

	}

	/**
	 * 获取日历控件的初始框架
	 * @returns {string}
	 */
	function getDatePickerHTML(){
		return '<div class="frm-dp">' +
					'<div class="frm-dp-title">' +
						'<i id="datePrev" class="icon icon-keyboard_arrow_left u-pull-left"></i>' +
						'<i id="dateNext" class="icon icon-keyboard_arrow_right u-pull-right"></i>' +
						'<div class="frm-dp-title-text"></div>' +
					'</div>' +
					'<div class="frm-dp-content">' +
					'</div>' +
				'</div>';
	}

	/**
	 * 获取当前月份
	 * @param parent
	 * @returns {Date}
	 */
	function getCurrentMonth(parent){
		return new Date(parseInt(parent.querySelector('.frm-dp-title-text').getAttribute('data-year-month')));
	}

	/**
	 * 获取当前选择的日期
	 * @returns {Date}
	 */
	function getSelectDate(parent){
		return new Date(parseInt(parent.querySelector('.frm-dp-title-text').getAttribute('data-select-date')));
	}
	function setSelectDate(parent, date){
		parent.querySelector('.frm-dp-title-text').setAttribute('data-select-date', date.getTime());
	}

	/**
	 * 设置当前月份，包括标题、月份面板、当前的月份缓存
	 * @param parent
	 * @param monthDate
	 */
	function setCurrentMonth(parent, monthDate){
		//  设置标题和标题中的时间缓存
		var dateTitle = parent.querySelector('.frm-dp-title-text');
		dateTitle.setAttribute('data-year-month', monthDate.getTime());
		dateTitle.innerHTML = (monthDate.getMonth() + 1) + '月' + monthDate.getFullYear() + '年';
		//  充值month日期
		parent.querySelector('.frm-dp-content').innerHTML = getMonthHTML(parent, monthDate);
	}

	/**
	 * 重置月份，分为两步：设置当前的月份面板、绑定月份面面板事件
	 * @param parent
	 * @param monthDate
	 */
	function resetMonth(parent, monthDate){
		setCurrentMonth(parent, monthDate);
		bindDatePickerMonthEvent(parent);
	}

	/**
	 * 绑定日历控件的时间，主要有前后切换月份的事件
	 * @param parent
	 */
	function bindDatePickerEvent(parent){
		document.getElementById('datePrev').addEventListener('click', function(){
			resetMonth(parent, firstDayOfMonth(getCurrentMonth(parent), -1));
		});
		document.getElementById('dateNext').addEventListener('click', function(){
			resetMonth(parent, firstDayOfMonth(getCurrentMonth(parent), 1));
		});
	}

	/**
	 * 绑定月份面板上的日期事件
	 * @param parent
	 */
	function bindDatePickerMonthEvent(parent){
		var itemList = parent.querySelectorAll('.frm-dp-day');
		for (var item of itemList) {
			item.addEventListener('click', function(){
				pickerItemSelect.call(this, 'frm-dp-selected', true, parent);
				setSelectDate(parent, new Date(parseInt(this.getAttribute('data-date'))));
			});
		}
	}

	var eTitle = document.getElementById('frmTitle');
	var eBackButton = document.getElementById('frmBack');
	var eOptionButtons = document.getElementById('frmOptionButtons');

	eTitle.innerText = document.title;
	eBackButton.addEventListener('click', function(){window.history.back();});

	// var listenerStack = [];

	window.rsqwork = {
		setTitle: function(params){
			eTitle.innerText = params.title
			if(params.hideBack){
				eBackButton.classList.add('is-hidden');
			}else{
				eBackButton.classList.remove('is-hidden');
			}
		},
		setOptionButtons: function(params){
			//  清空eOptionButtons
			eOptionButtons.innerHTML = '';
			//  根据params.btns的数量来判断显示
			if(!params.btns) return;

			if(params.btns.length == 1){
				setMainButton(params.btns[0], params.success);
			}else{
				setMainButton({name: '更多'}, toggleSub);
				setSubButtons(params.btns, params.success);
			}
		},
		picker: function(params){
			var list = renderPickerList(params.items, params.defaultValue);
			var wrapper = newElement();
			wrapper.appendChild(list);

			layer.open({
				title: params.title,
				style: 'width: 50%;',
				className: 'frm-picker',
				content: wrapper.innerHTML,
				btn: ['确定','取消'],
				success: function(lay){
					//  绑定事件
					bindPickerListEvent(lay);
				},
				yes: function(index){
					//  找到当前选择的项，传给返回值
					var selEle = document.querySelector('.frm-picker-item--checked');
					var selItem;
					if(selEle){
						selItem = params.items[selEle.getAttribute('id').split('-')[1]];
					}
					rsqChk(params.success, [selItem]);
					layer.close(index);
				}
			});
		},
		datePicker: function(params){
			var list = getDatePickerHTML();

			layer.open({
				title: '选择日期',
				style: 'width: 50%;',
				className: 'frm-picker',
				content: list,
				btn: ['确定','取消'],
				success: function(lay){
					//  绑定事件
					bindDatePickerEvent(lay);
					var now = new Date(params.init);
					setSelectDate(lay, now);
					resetMonth(lay, now);
				},
				yes: function(index){
					//  找到当前选择的项，传给返回值
					var selDate = getSelectDate(document);
					rsqChk(params.success, [{date: selDate}]);
					layer.close(index);
				}
			});
		}
	};
})(window, document);