(function(win){
  win.rsqSpace = win.rsqSpace || {};
  var mgrObj = {},
    funNameList = [
      'auth', 'sign',
      'init',
      'log',
      'error',
      'disableBounce',
      'setTitle', 'setOptionButtons','hideOptionButtons', 'selectDeptMember', 'selectMember',
      'alert',
      'confirm',
      'prompt',
      'showLoader',
      'hideLoader',
      'actionsheet',
      'toast', 'picker', 'datePicker', 'timePicker', 'timePicker2', 'deleteUserCache',
      'notify','pickConversation', 'getItem', 'setItem', 'deleteItem',
      'checkVersion', 'upgradeVersion','topTips',
      'checkDevice'
    ];
  function register(adapter){
    extend(mgrObj, adapter);
  }
  function extend(orgObj, newObj){
    for(var key in newObj){
      if(newObj.hasOwnProperty(key) && ~funNameList.indexOf(key)){
        orgObj[key] = newObj[key];
      }
    }
  }
  function execute(funName, params){
    if(typeof mgrObj[funName] === 'function'){
      return mgrObj[funName].call(null, params);
    }else{
      console.error('the function ' + funName + ' you registered is not valid, so it has not been set');
      return null
    }
  }

  var ajax = {};
  ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    var versions = [
      "MSXML2.XmlHttp.6.0",
      "MSXML2.XmlHttp.5.0",
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0",
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch (e) {
      }
    }
    return xhr;
  };

  ajax.send = function (url, callback, method, data, async) {
    //  callback可以为function, 也可以为Array
    var empty = function () {};
    var funSuccess = empty;
    var funError = empty;
    if (callback) {
      if (typeof callback == 'function') {
        funSuccess = callback;
        funError = empty;
      } else if (callback instanceof Array && callback.length > 1) {
        funSuccess = callback[0];
        funError = callback[1];
      }
    }
    if (async === undefined) {
      async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
      if (x.readyState == 4) {
        if(x.status == 200){
          funSuccess(x.responseText)
        }else{
          funError({status: x.status})
        }
      }
    };
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (method == 'POST') {
      x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
  };

  ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
  };

  ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
  };


  win.rsqadmg = win.rsqAdMg = win.rsqAdapterManager = win.rsqSpace.adapterManager = {
    log: function(message){
      rsqadmg.execute('log', {message: message});
    },
    error: function(message){
      rsqadmg.execute('error', {message: message});
    },
    register: register,
    exec: execute,
    execute: execute,
    ajax: ajax
  };

})(window);
// (function (window, document) {
//   var ALERT_ID = 'rsqWeAlert'
//   var TOAST_ID = 'toast'
//   function makeElement (params) {
//     var tag = params.tag || "div"
//     var ele = document.createElement(tag)
//     if (params.id) {
//       ele.setAttribute("id", params.id)
//     }
//     if (params.classList) {
//       ele.setAttribute("class", params.classList)
//     }
//     if (params.style) {
//       ele.setAttribute("style", params.style)
//     }
//     return ele
//   }
//   function alertTemplate (options){
//     var title = options.title || '提示'
//     var msg = options.message || ''
//     var btn = options.button || '确定'
//     var html =
//       '<div class="weui-mask"></div>' +
//       '<div class="weui-dialog">' +
//       '<div class="weui-dialog__hd">' +
//       '<strong class="weui-dialog__title">' + title + '</strong>' +
//       '</div>' +
//       '<div class="weui-dialog__bd">' + msg + '</div>' +
//       '<div class="weui-dialog__ft">' +
//       '<a id="rsqAlertBtn" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">' + btn + '</a>' +
//       '</div>' +
//       '</div>'
//     return html
//   }
//   function ToastTemplate() {
//     return  '<div class="weui_mask_transparent"></div><div class="weui_toast"><i class="weui_icon_toast"></i><p class="weui_toast_content">' + '创建完成' + '</p></div></div>'
//   }
//   function showAlert (params) {
//     var ele = makeElement({id: ALERT_ID})
//     console.log(alertTemplate(params))
//     ele.innerHTML = alertTemplate(params)
//     document.body.appendChild(ele)
//     var btn = ele.querySelector(".weui-dialog__btn")
//     btn.addEventListener('click', hideAlert)
//   }
//   function hideAlert (params) {
//     var ele = document.getElementById(ALERT_ID)
//     document.body.removeChild(ele)
//   }
//   function showToast (params) {
//     var ele = makeElement({id: TOAST_ID})
//     ele.innerHTML = ToastTemplate()
//     document.body.appendChild(ele)
//   }
//   function hideToast (params) {
//     var ele = document.getElementById(TOAST_ID)
//     document.body.removeChild(ele)
//   }
//   window.rsqwork = {
//     showAlert: showAlert,
//     hideAlert: hideAlert,
//     showToast: showToast,
//     hideToast: hideToast
//   }
// })(window, document)
