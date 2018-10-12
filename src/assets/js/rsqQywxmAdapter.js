function rsqChk(fun, p){
  if(typeof fun == 'function'){
    fun.apply(null, p);
  }
}
function rsqNvl(orgVal, defValue){
  return null === orgVal || undefined === orgVal ? defValue : orgVal;
}
function padLeft(num){
  return (num > 9 ? '' :'0') + num;
}
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
function checkDevice() {
  var userAgent = window.navigator.userAgent.toLowerCase()
  var ios = /iphone|ipod|ipad/.test( userAgent )
  var Windows = /windows/.test( userAgent )
  var Macintosh = /macintosh/.test( userAgent )
  var result = {}

  if (ios) {
    result['os'] = 'iOS'
  } else if (Windows) {
    result['os'] = 'Windows'
  } else if (Macintosh) {
    result['os'] = 'Macintosh'
  } else {
    result['os'] = 'unknow'
  }
  return result
}

//写cookies

function setCookie(name,value)
{
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  if(arr=document.cookie.match(reg))

    return decodeURIComponent(arr[2]);
  else
    return null;
}

//删除cookies
function deleteCookie(name)
{
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
rsqadmg.store = {};
rsqadmg.store.app = getJsonFromUrl();
rsqadmg.store.app.appid = rsqadmg.store.app.agentid;
//  oauth对象中的key和value值适用于微信oauth认证，key和value只均不允许修改
rsqadmg.store.oauth = {
  url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  params: {
    response_type: 'code',
    scope: 'snsapi_base',
    state: 'STATE',
    redirect_uri: encodeURIComponent(rsqConfig.authServer + 'oauth/after?corpId=' + rsqadmg.store.app.corpid + '&agentId=' + rsqadmg.store.app.agentid)
  }
};

/**
 * 关于企业微信webview中的oauth授权，企业微信改过几个版本，目前的版本为：
 * https://work.weixin.qq.com/api/doc#10975/%E7%BD%91%E9%A1%B5%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%E7%AC%AC%E4%B8%89%E6%96%B9
 * @param suiteKey
 * @returns {string}
 */
function getOauthUrl(suiteKey){
  var data = rsqadmg.store.oauth;
  data.params.appid = suiteKey;
  var base = data.url;
  var pArray = [];
  for(var key in data.params){
    if(data.params.hasOwnProperty(key)){
      pArray.push(key + '=' + data.params[key]);
    }
  }
  return base + '?' + pArray.join('&') + '#wechat_redirect';
}
var loading
/**
 * adapter钉钉适配，参加钉钉jssdk文档
 * @link https://open-doc.dingtalk.com/docs/doc.htm
 */
rsqAdapterManager.register({
  auth: function(params){
    //------------------------------------------------------------
    var authUser = {
  "id": 2,
  "corpId": "wwe485b663d56c2ec2",
  "userId": "zhengjie",
  "name": "毛文强",
  "department": "[1]",
  "orderInDepts": "[0]",
  "isLeaderInDepts": "null",
  "position": null,
  "mobile": null,
  "gender": "1",
  "email": null,
  "avatar": "http://p.qlogo.cn/bizmail/6E9R4OlZkj3iaEQ15IFmaoGRicFBW2FeaVvq3GGWbHSmXF6xNWvhWxFA/0",
  "tel": null,
  "englishName": null,
  "status": 1,
  "extattr": null,
  "adminType": 1,
  "unionId": null,
  "rsqUserId": "2921",
  "rsqUsername": "tEfNI_1525241922301@qywxtest.rishiqing.com",
  "rsqPassword": "IZQXGs",
  "rsqLoginToken": "tbLGdJxXUHJfZZfLRBvmpOKakTCU3eRu3L3f7nGjZB51v/1/pXN3OFsSka4R/xmc"
}
    rsqAdapterManager.ajax.get(rsqConfig.apiServer + 'task/qywxOauth/tokenLogin', {
      token: authUser.rsqLoginToken
    }, function(result){
      var resJson = JSON.parse(result);
      console.log(JSON.stringify(resJson))
      if(resJson.success){
        rsqChk(params.success, [resJson, authUser]);
      }else{
        rsqChk(params.error, [resJson]);
      }
    });
    return
    //--------------------------------------------------------

    //先取签名
    rsqadmg.execute('sign', {
        success: function(res){
          rsqadmg.execute('init', {
            suiteKey: res.suiteKey,
            appId: res.corpId,
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            success: function(authUser){
              var loginUrl = rsqConfig.apiServer + 'task/qywxOauth/tokenLogin';
              rsqAdapterManager.ajax.post(loginUrl, {
                token: authUser.rsqLoginToken
              }, function(result){
                //  企业微信打开默认浏览器直接登录
                if (wx) {
                  if (checkDevice().os === 'Windows' || checkDevice().os === 'Macintosh') {
                    window.location.href = rsqConfig.rsqServer + 'task/qywxOauth/tokenDirectSignIn?token=' + encodeURIComponent(authUser.rsqLoginToken)
                  }
                  // wx.invoke('openDefaultBrowser', {
                  //   'url': rsqConfig.rsqServer + 'task/qywxOauth/tokenDirectSignIn?token=' + encodeURIComponent(authUser.rsqLoginToken)
                  // }, function(res){
                  //   if(res.err_msg != "openDefaultBrowser:ok"){
                  //     //错误处理
                  //   }
                  // });
                }
                var resJson = JSON.parse(result);
                // console.log(JSON.stringify(resJson))
                if(resJson.success){
                  rsqChk(params.success, [resJson, authUser]);
                }else{
                  rsqChk(params.error, [resJson]);
                }
              });
            },
            error: function(authResult){
              rsqChk(params.error, [authResult]);
            }
          });
        }
      }
    );
  },
  sign: function(params){
    var currentUrl = window.location.href.split('#')[0];
    var pa = rsqadmg.store.app;
    rsqAdapterManager.ajax.get(rsqConfig.authServer + 'get_js_config', {
      url: currentUrl,
      corpId: pa.corpid,
      agentId: pa.agentid
    }, function(resSign){
      var resJson = JSON.parse(resSign);
      rsqChk(params.success, [resJson]);
    });
  },
  init: function(params){
    var suiteKey = params.suiteKey
    wx.config({
      beta: true,  // 必须这么写，否则在微信插件有些jsapi会有问题
      debug: false,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: params.appId,  // 必填，企业微信的cropID
      timestamp: params.timeStamp, //  必填，生成签名的时间戳
      nonceStr: params.nonceStr,  // 必填，生成签名的随机串
      signature: params.signature,  // 必填，签名，见[附录1](#11974)
      // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      jsApiList: ['getNetworkType', 'hideOptionMenu', 'selectEnterpriseContact', 'openDefaultBrowser']
    });
    wx.ready(function(res){
      var appdata = rsqadmg.store.app;
      var cookieName = appdata.agentid + '-' + appdata.corpid + '-userId';

      //  执行删除cookie，后续在app中删除cookie
      // rsqadmg.exec('deleteUserCache', {
      //   name: cookieName
      // });

      var userCookie = getCookie(cookieName);
      //  从cookie中获取
      if(userCookie){
        //  直接从authServer获取到用户数据
        rsqAdapterManager.ajax.get(rsqConfig.authServer + 'corp/staff', {
          corpId: appdata.corpid, agentId: appdata.agentid, userId: userCookie
        }, function(result){
          var resJson = JSON.parse(result);
          if(resJson.errcode && resJson.errcode != '0'){
            rsqChk(params.error, [resJson]);
          }else{
            rsqChk(params.success, [resJson.user]);
          }
        });
      }else{
        var oauthUrl = getOauthUrl(suiteKey);
        window.location.href = oauthUrl;
      }
    });
    wx.error(function(err){
      //  如果是config:fail，那么就刷新jsapi ticket
      if(err['errMsg'] !== null){
        var pa = rsqadmg.store.app;
        rsqAdapterManager.ajax.get(rsqConfig.authServer + 'refresh_js_ticket', {
          corpId: pa.corpid,
          agentId: pa.agentid
        }, function(resSign){
          var resJson = JSON.parse(resSign);
          if(!resJson.errcode){
            window.location.reload();
          }
        });
      }
    });
  },
  deleteUserCache: function(params){
    deleteCookie(params.name);
  },
  autoLogin: function(params){

  },
  log: function(params){
    console.log(params.message)
  },
  error: function(params){
    console.log(JSON.stringify(params))
  },
  setTitle: function(params){
    document.title = params.title;
  },
  setOptionButtons: function(params){
    wx.showOptionMenu();
  },
  hideOptionButtons: function(params){
    wx.hideOptionMenu()
  },

  /**
   * alert提示框
   * @param params.title
   * @param params.message
   * @param params.buttonName
   * @param params.onSuccess
   * @param params.onFail
   */
  alert: function(params){
    weui.alert(params.message);
  },
  /**
   * confirm提示框
   * @param params.title
   * @param params.message
   * @param params.buttonLabels
   * @param params.onSuccess
   * @param params.onFail
   */
  confirm: function(params){
    weui.confirm(
      '',
      function(){
        rsqChk(params.success, []);
      },
      function(){
        rsqChk(params.cancel, []);
      },
      {title: params.message}
    );
  },
  /**
   * prompt提示框
   * @param params.title
   * @param params.message
   * @param params.buttonLabels
   * @param params.onSuccess
   * @param params.onFail
   */
  prompt: function(params){},
  /**
   * 显示加载框
   * @param params.text
   * @param params.showIcon
   * @param params.onSuccess
   * @param params.onFail
   */
  showLoader: function(params){
    loading = weui.loading(params.text, {
      className: 'custom-classname'
    });
  },
  /**
   * 隐藏加载库
   * @param params.onSuccess
   * @param params.onFail
   */
  hideLoader: function(params){
    loading.hide(function() {
      console.log('`loading` has been hidden');
    });
  },
  topTips: function (params) {
    weui.topTips(params.message, params.options);
  },
  /**
   * actionsheet
   * @param params.title
   * @param params.cancelButton
   * @param params.otherButtons
   * @param params.onSuccess
   * @param params.onFail
   */
  actionsheet: function(params){
    if (params.buttonArray.length === 3) {
      weui.actionSheet([
          {
            label: params.buttonArray[0],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 0}]);
            }
          }, {
            label:  params.buttonArray[1],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 1}]);
            }
          }, {
            label: params.buttonArray[2],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 2}]);
            }
          }
          // {
          //   label: '取消',
          //   onClick: function () {
          //     // rsqChk(params.success, [{buttonIndex: 3}]);
          //   }
          // }
        ],
        {
          className: 'custom-classname',
          onClose: function(){
            console.log('关闭');
          }
        }, {isAndroid:false});
    } else {
      weui.actionSheet([
          {
            label: params.buttonArray[0],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 0}]);
            }
          }, {
            label:  params.buttonArray[1],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 1}]);
            }
          }
          // , {
          //   label: '取消',
          //   onClick: function () {
          //     console.log('取消');
          //     // rsqChk(params.success, [{buttonIndex: 3}]);
          //   }
          // }
        ],
        {
          className: 'custom-classname',
          onClose: function(){
            console.log('关闭');
          }
        }, {isAndroid:false, className: params.className});
    }
  },
  /**
   * toast
   * @param params.text
   * @param params.showIcon
   * @param params.duration
   * @param params.delay
   * @param params.onSuccess
   * @param params.onFail
   */
  toast: function(params){
    weui.toast(params.message, {
      duration: 1500
    });
  },
  selectDeptMember: function(params){
    wx.invoke('selectEnterpriseContact', {
        'fromDepartmentId': -1,// 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
        'mode': 'multi',// 必填，选择模式，single表示单选，multi表示多选
        'type': ['user'],// 必填，选择限制类型，指定department、user中的一个或者多个
        'selectedDepartmentIds': [],// 非必填，已选部门ID列表。用于多次选人时可重入
        'selectedUserIds': params.selectedIds// 非必填，已选用户ID列表。用于多次选人时可重入
      },function(res){
        rsqChk(params.success, [res]);
        if (res.err_msg == "selectEnterpriseContact:ok")
        {
          if(typeof res.result == 'string')
          {
            res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
          }
          var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
          for (var i = 0; i < selectedDepartmentList.length; i++)
          {
            var department = selectedDepartmentList[i];
            var departmentId = department.id;// 已选的单个部门ID
            var departemntName = department.name;// 已选的单个部门名称
          }
          var selectedUserList = res.result.userList; // 已选的成员列表
          for (var i = 0; i < selectedUserList.length; i++)
          {
            var user = selectedUserList[i];
            var userId = user.id; // 已选的单个成员ID
            var userName = user.name;// 已选的单个成员名称
            var userAvatar= user.avatar;// 已选的单个成员头像
          }
        }
      }
    );
  },
  selectMember: function(params){
  },
  picker: function(params){
  },
  datePicker: function(params){
  },
  timePicker: function(params){
    var minites = []
    for (var j= 0; j <= 100; j++) {
      var minites_item = {};
      minites_item.label = j
      minites_item.value = j;
      minites.push(minites_item);
    }
    var when = [{label: '提前', value: 'begin'}]
    var unit = [{label: '分钟', value: 'min'},{label: '小时', value: 'hour'}]
    var defaultValue = ['begin', '50', 'min']
    weui.picker(when, minites, unit, {
      id: 'time-picker' + new Date().getTime(),  // 使用变化的id，保证不做缓存，每次都新建picker
      defaultValue: defaultValue,
      onConfirm: function(result) {
        var result = {value: result}
        rsqChk(params.success, [result]);
      }
    });
  },
  /**
   * timePicker2魔改版
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  timePicker2: function(params){
    var hours = [],
    minites = [],
    symbol = [{ label: ' ', value: 0 }];
    if (!hours.length) {
      for (var i = 0; i< 24; i++) {
        var hours_item = {};
        hours_item.label = ('' + i).length === 1 ? '0' + i + '时': '' + i + '时';
        hours_item.value = i;
        hours.push(hours_item);
      }
    }
    if (!minites.length) {
      for (var j= 0; j < 60; j++) {
        var minites_item = {};
        minites_item.label = ('' + j).length === 1 ? '0' + j + '分': '' + j + '分';
        minites_item.value = j;
        minites.push(minites_item);
      }
    }
    var defString = params.strInit || '00:00';
    var defArray = [defString.substr(0, 2), ':', defString.substr(3, 2)];
    var defArray2 = [defString.substr(0, 2), ':', defString.substr(3, 2)];
    if (defString.substr(0, 2) !== '23') {
      defArray2[0] = Number(defString.substr(0, 1) + (defString.substr(1, 1) * 1 + 1))
      if (defString.substr(0, 1) === '1' && (defString.substr(1, 1) * 1 + 1) === 10) {
        defArray2[0] = 20
      }
    }
    var defString2 = params.strInit2 || defArray2.join('');
    weui2.picker(hours, symbol, minites, {
      id: 'time-picker' + new Date().getTime(),  // 使用变化的id，保证不做缓存，每次都新建picker
      defaultValue: defArray,
      onChange: function (result) {
        var h = (102 - parseInt(document.querySelectorAll('.weui-picker__content')[0].style.transform.split(',')[1]))/34
        var m = (102 - parseInt(document.querySelectorAll('.weui-picker__content')[2].style.transform.split(',')[1]))/34
        var hz = 0 
        var mz = 0
        if (isNaN(m)){
          m = parseInt(result[2].value)
        }
        if (h < 10) {
          hz = "0" + h
        } else {
          hz = h
        }
        if (m < 10) {
          mz = "0" + m
        } else {
          mz = m
        }
        result = [
        {
          label: hz +"时",
          value: hz
        },
        {
          label: '',
          value: 0
        },{
          label: mz +"分",
          value: mz
        }]
        if (params.start) {
          var f = result[0].label.substr(0,1)
          var s = result[0].label.substr(1,1) * 1 + 1
          if (s === 10 && f === '0') {
            f = ''
          }
          if (s === 10 && f === '1') {
            f = '2'
            s = '0'
          }
          var timeEnd = f + s === '24' ? '23' : f + s
          var time2 = timeEnd + ':' + result[2].label.substr(0,2)
          document.querySelector('#endTime').innerHTML = time2

        }
        var time = result[0].label.substr(0,2) + ':' + result[2].label.substr(0,2)
        document.querySelector('._c ._s-time').innerHTML = time
      },
      onConfirm: function(result) {
        let startTime =  document.querySelector('#startTime').innerHTML
        let endTime = document.querySelector('#endTime').innerHTML
        // var time = result[0].label + ':' + result[2].label;
        // var result = {value: time}
        rsqChk(params.success, [startTime, endTime]);
      }
    });
      document.querySelector('#endTime').innerHTML = defString2
    //设定左右切换
      document.querySelector("#_tl").addEventListener('click', () => {
      document.querySelector("#_tr").classList.remove('_c')
      document.querySelector("#_tl").classList.add('_c')
      var h = document.querySelectorAll('.weui-picker__content')[0].style.transform.split(',')
      var m = document.querySelectorAll('.weui-picker__content')[2].style.transform.split(',')
      var hourtNew = 102 - document.querySelector('._c ._s-time').innerText.split(':')[0] * 34 + 'px'
      var minNew = 102 - document.querySelector('._c ._s-time').innerText.split(':')[1] * 34 + 'px'
      document.querySelectorAll('.weui-picker__content')[0].style.transform = h[0] + ',' + hourtNew + ',' + h[2]
      document.querySelectorAll('.weui-picker__content')[2].style.transform = m[0] + ',' + minNew + ',' + m[2]
    })
    document.querySelector("#_tr").addEventListener('click', () => {
      document.querySelector("#_tl").classList.remove('_c')
      document.querySelector("#_tr").classList.add('_c')
      var h = document.querySelectorAll('.weui-picker__content')[1].style.transform.split(',')
      var m = document.querySelectorAll('.weui-picker__content')[2].style.transform.split(',')
      var hourtNew = 102 - document.querySelector('._c ._s-time').innerText.split(':')[0] * 34 + 'px'
      var minNew = 102 - document.querySelector('._c ._s-time').innerText.split(':')[1] * 34 + 'px'
      document.querySelectorAll('.weui-picker__content')[0].style.transform = h[0] + ',' + hourtNew + ',' + h[2]
      document.querySelectorAll('.weui-picker__content')[2].style.transform = m[0] + ',' + minNew + ',' + m[2]
    })
    if (!params.start) {
      document.querySelector("#_tr").click()
    }
  },
  disableBounce: function(){
    //  去掉iOS的回弹效果
  },
  /**
   * 钉钉中发Ding
   * @param params
   */
  notify: function(params) {
  },
  /**
   * 发送到聊天
   * @param prams
   */
  pickConversation: function(params) {
  },
  /**
   * 从localStorage中获取值
   * @param params
   */
  getItem: function(params) {
    //  检查是否存在version信息，version信息以整数为准，初始值为1
    if (window.localStorage) {
      var item = localStorage.getItem(params.name)
      rsqChk(params.success, [{key: params.name, value: item}])
    } else {
      alert('localStorage not found!')
    }
  },
  setItem: function(params) {
    if (window.localStorage) {
      localStorage.setItem(params.name, params.value)
      rsqChk(params.success, [{key: params.name, value: params.value}])
    } else {
      alert('localStorage not found!')
    }
  },
  removeItem: function(params) {
    if (window.localStorage) {
      localStorage.removeItem(params.name)
      rsqChk(params.success, [{}])
    } else {
      alert('localStorage not found!')
    }
  },
  checkDevice: checkDevice
})
