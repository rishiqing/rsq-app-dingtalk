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
function makeToken(corpId, userId){
  return corpId + '--' + userId
}
rsqadmg.store = {
  app: getJsonFromUrl()
};

/**
 * adapter钉钉适配，参加钉钉jssdk文档
 * @link https://open-doc.dingtalk.com/docs/doc.htm
 */
rsqAdapterManager.register({
  auth: function(params){
    //  先取签名
    rsqadmg.execute('sign', {
        success: function(res){
          // var json = JSON.stringify(res);
          // 再进行jssdk初始化
          rsqadmg.execute('init', {
            agentId: res.agentId,
            "corpId": rsqadmg.store.app.corpid,
            "timeStamp": res.timeStamp,
            "nonceStr": res.nonce,
            "signature": res.signature,
            success: function(authUser){
              // var authUser = authResult.user;
              //  从authServer获取到用户数据后进行登录
              var token = makeToken(authUser.corpId, authUser.userId);
              rsqAdapterManager.ajax.post(rsqConfig.apiServer + 'task/dingtalkOauth/tokenLogin', {
                token: token
              }, [function(result){
                var resJson = JSON.parse(result);
                if(resJson.success){
                  rsqChk(params.success, [resJson, authUser]);
                }else{
                  rsqChk(params.error, [resJson]);
                }
              }, function(err){
                rsqChk(params.error, [err]);
              }]);
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
    console.log(rsqConfig.authServer + 'get_js_config')
    rsqAdapterManager.ajax.get(rsqConfig.authServer + 'get_js_config', {
      url: currentUrl,
      corpid: pa.corpid,
      appid: pa.appid
    }, function(resSign){
      var resJson = JSON.parse(resSign);
      rsqChk(params.success, [resJson]);
    });
    // rsqChk(params.success, [{}]);
  },
  init: function(params){
    // rsqChk(params.success, [{rsqUsername: 'KGcPR_1484054002748@dingtalk.rishiqing.com', rsqPassword: 'YcCTVA'}]);
    dd.config({
      "agentId": params.agentId,
      "corpId": rsqadmg.store.app.corpid,
      "timeStamp": params.timeStamp,
      "nonceStr": params.nonceStr,
      "signature": params.signature,
      jsApiList: [
        'runtime.info',
        'biz.chat.pickConversation',
        'biz.customContact.choose',
        'biz.customContact.multipleChoose',
        'biz.chat.open',
        'biz.util.open',
        'biz.user.get',
        'biz.contact.choose',
        'biz.telephone.call',
        'biz.ding.create',
        'biz.ding.post']
    });
    dd.ready(function(res){

      var appdata = rsqadmg.store.app;
      var cookieName = appdata.appid + '-' + appdata.corpid + '-userId';

      //  执行删除cookie，后续在app中删除cookie
      // rsqadmg.exec('deleteUserCache', {
      //   name: cookieName
      // });

      var userCookie = getCookie(cookieName);

      //  从cookie中获取
      if(userCookie){
        //  直接从authServer获取到用户数据
        rsqAdapterManager.ajax.get(rsqConfig.authServer + 'staff/userId', {
          corpid: appdata.corpid, appid: appdata.appid, userid: userCookie
        }, function(result){
          var resJson = JSON.parse(result);
          if(resJson.errcode && resJson.errcode != '0'){
            rsqChk(params.error, [resJson]);
          }else{
            rsqChk(params.success, [resJson.user]);
          }
        });
      }else{
        //  如果cookie中不存在用户信息，则调用authCode请求
        dd.runtime.permission.requestAuthCode({
          corpId: appdata.corpid, //企业id
          onSuccess: function (info) {
            var url = rsqConfig.authServer + 'staff/authCode';
            rsqAdapterManager.ajax.get(url, {
              appid: appdata.appid,
              corpid: appdata.corpid,
              code: info.code
            }, function(resSign){
              var authResult = JSON.parse(resSign);
              if(authResult.errcode && authResult.errcode != '0'){
                rsqChk(params.error, [authResult]);
              }else{
                setCookie(cookieName, authResult.user.userId);
                rsqChk(params.success, [authResult.user]);
              }
            });
          },
          onFail: function (err) {
            alert('requestAuthCode fail: ' + JSON.stringify(err));
          }
        });
      }
    });
    dd.error(function(err){
      alert('dd error: ' + JSON.stringify(err));
    });
  },
  deleteUserCache: function(params){
    deleteCookie(params.name);
  },
  autoLogin: function(params){

  },
  log: function(params){
    // console.log(params.message)
  },
  setTitle: function(params){
    dd.biz.navigation.setTitle({
      title : params.title,//控制标题文本，空字符串表示显示默认文本
      onSuccess : function(result) {
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
  },
  setOptionButtons: function(params){
    if(params.hide){
      dd.biz.navigation.setRight({
        show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        text: '隐藏',//控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
          //如果control为true，则onSuccess将在发生按钮点击事件被回调
          rsqChk(params.success);
        },
        onFail : function(err) {
          alert(JSON.stringify(err));
        }
      });
    }else{
      params.btns = params.btns || []
      var items = params.btns.map(function(item){
        return {
          id: item.key,
          text: item.name

        }
      });
      dd.biz.navigation.setMenu({
        // backgroundColor : "#ADD8E6",
        items : items,
        onSuccess: function(data) {
          var btn = {};
          params.btns.forEach(function(item){
            if(item.key == data.id

            ){
              btn = item;
            }
          });
          rsqChk(params.success, [btn]);
        },
        onFail: function(err) {
          alert(JSON.stringify(err));
        }
      });
    }
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
    dd.device.notification.alert({
      message: params.message,
      title: params.title || '提示',//可传空
      buttonName: params.buttonName || "收到",
      onSuccess : function(res) {
        rsqChk(params.success, [res]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
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
    var btn1 = params.confirmName || '确定';
    var btn2 = params.cancelName || '取消';
    dd.device.notification.confirm({
      message: params.message,
      title: "提示",
      buttonLabels: [btn2, btn1],
      onSuccess : function(result) {
        //onSuccess将在点击button之后回调
        /*
         {
         buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
         }
         */
        if(0 == result.buttonIndex){
          rsqChk(params.cancel, []);
        }else if(1 == result.buttonIndex){
          rsqChk(params.success, []);
        }
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
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
    params = params || {};
    var text = params.text || '';
    console.log(text)
    dd.device.notification.showPreloader({
      text: text, //loading显示的字符，空表示不显示文字
      showIcon: true, //是否显示icon，默认true
      onSuccess : function(result) {
        /*{}*/
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    })
  },
  /**
   * 隐藏加载库
   * @param params.onSuccess
   * @param params.onFail
   */
  hideLoader: function(params){
    dd.device.notification.hidePreloader({
      onSuccess : function(result) {
        /*{}*/
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    })
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
    dd.device.notification.actionSheet({
      // title: "请选择操作", //标题
      cancelButton: '取消', //取消按钮文本
      otherButtons: params.buttonArray,
      onSuccess : function(result) {
        rsqChk(params.success, [result]);
        /*{
         buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1
         }*/
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
        rsqChk(params.error, err);
      }
    });
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
    dd.device.notification.toast({
      icon: '', //icon样式，有success和error，默认为空 0.0.2
      duration: 1,
      text: params.message, //提示信息
      onSuccess : function(result) {
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    })
  },
  selectDeptMember: function(params){
    dd.biz.contact.choose({
      startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
      multiple: params.multiple, //是否多选： true多选 false单选； 默认true
      users: params.selectedIds, //默认选中的用户列表，userid；成功回调中应包含该信息
      disabledUsers:params.disabledIds || [],//['10001', '10002', ...],// 不能选中的用户列表，员工userid
      corpId: rsqadmg.store.app.corpid, //企业id
      max: params.maximum, //人数限制，当multiple为true才生效，可选范围1-1500
      limitTips:"超出人数限制", //超过人数限制的提示语可以用这个字段自定义
      isNeedSearch:true, // 是否需要搜索功能
      title : params.title, // 如果你需要修改选人页面的title，可以在这里赋值
      local: true, // 是否显示本地联系人，默认false
      onSuccess: function(data) {
        rsqChk(params.success, [data]);
        //onSuccess将在选人结束，点击确定按钮的时候被回调
        /* data结构
         [{
         "name": "张三", //姓名
         "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
         "emplId": '0573', //userid
         },
         ...
         ]
         */
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
        rsqChk(params.error, data);
      }
    });
  },
  selectMember: function(params){
    dd.biz.customContact.multipleChoose({
      title: params.title, //标题
      users: params.userIds,//一组员工userid
      corpId: params.corpId,//加密的企业 ID，
      isShowCompanyName: true,   //true|false，默认为 false
      selectedUsers: params.selectedIds,
      disabledUsers: params.disabledIds || [], //不能选的人
      onSuccess: function(data) {
        alert(JSON.stringify(data));
        rsqChk(params.success, [data]);
        /* data结构
         [{
         "name": "张三", //姓名
         "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
         "emplId": '0573', //userid，[<font color=red>获取成员详情接口</font>](https://open-doc.dingtalk.com/doc2/detail.htm?&articleId=104979&docType=1#s12)

         },
         ...
         ]
         */
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
        rsqChk(params.error, data);
      }
    });
  },
  picker: function(params){
    var items = params.items.map(function(item){
      return {
        key: item.name,
        value: item.value
      }
    });
    dd.biz.util.chosen({
      source:items,
      onSuccess : function(result) {
        rsqChk(params.success, [{
          name: result.key,
          value: result.value
        }]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    })
  },
  datePicker: function(params){
    var newDate = new Date(params.init);
    var formatVal = newDate.getFullYear() + '-' + padLeft(newDate.getMonth() + 1) + '-' + newDate.getDate();
    dd.biz.util.datepicker({
      format: 'yyyy-MM-dd',
      value: formatVal, //默认显示
      onSuccess : function(res) {
        res.result = res.value;
        var arr = res.value.split('-');
        var d = new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]));
        res.date = d;
        res.time = d.getTime();
        rsqChk(params.success, [res]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    })
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
  // timePicker: function(params){
  //   var strInit = params.strInit || '00:00'
  //   dd.biz.util.timepicker({
  //     format: 'HH:mm',
  //     value: strInit, //默认显示时间  0.0.3
  //     onSuccess : function(res) {
  //       rsqChk(params.success, [res]);
  //       //onSuccess将在点击完成之后回调
  //       /*{
  //                    value: "10:00"
  //                }
  //                */
  //     },
  //     onFail : function(err) {
  //       alert(JSON.stringify(err));
  //     }
  //   })
  // },
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
    dd.ui.webViewBounce.disable();
  },
  /**
   * 钉钉中发Ding
   * @param params
   */
  notify: function(params) {
    dd.biz.ding.post({
      users: params.userIds, // 用户列表，工号
      corpId: params.corpId, // 企业id
      type: 2, // 钉类型 1：image  2：link
      alertType: 2,
      alertDate: {'format': 'yyyy-MM-dd HH:mm', 'value': params.alertTime},
      attachment: {
        title: '',
        url: '',
        image: '',
        text: ''
      },
      text: params.title, // 消息
      onSuccess: function () {
        rsqChk(params.success, [res]);
      },
      onFail: function () {}
    })
  },
  /**
   * 发送到聊天
   * @param prams
   */
  pickConversation: function(params) {
    dd.biz.chat.pickConversation({
      corpId: params.corpId, // 企业id
      isConfirm: 'true', // 是否弹出确认窗口，默认为true
      onSuccess: function (res) {
        rsqChk(params.success, [res]);
      },
      onFail: function () {
      }
    })
  },
  /**
   * error
   * @author lumozx
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  error: function(params){
    console.log(params)
  },
  /**
   * 从localStorage中获取值
   * @param params
   */
  getItem: function(params) {
    //  检查是否存在version信息，version信息以整数为准，初始值为1
    dd.util.domainStorage.getItem({
      name: params.name , // 存储信息的key值
      onSuccess : function(info) {
        rsqChk(params.success, [info]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
  },
  setItem: function(params) {
    dd.util.domainStorage.setItem({
      name: params.name, // 存储信息的key值
      value: params.value, // 存储信息的Value值
      onSuccess : function(info) {
        rsqChk(params.success, [info]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
  },
  removeItem: function(params) {
    dd.util.domainStorage.removeItem({
      name: params.name, // 存储信息的key值
      onSuccess : function(info) {
        rsqChk(params.success, [info]);
      },
      onFail : function(err) {
        alert(JSON.stringify(err));
      }
    });
  },
  checkDevice: checkDevice,
})
