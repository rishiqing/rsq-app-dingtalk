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
    appid: rsqadmg.store.app.corpid,
    agentid: rsqadmg.store.app.agentid,
    response_type: 'code',
    scope: 'snsapi_base',
    state: 'STATE',
    redirect_uri: encodeURIComponent(rsqConfig.authServer + 'oauth/after?corpId=' + rsqadmg.store.app.corpid + '&agentId=' + rsqadmg.store.app.agentid)
  }
};
function getOauthUrl(){
  var data = rsqadmg.store.oauth;
  var base = data.url;
  var pArray = [];
  for(var key in data.params){
    if(data.params.hasOwnProperty(key)){
      pArray.push(key + '=' + data.params[key]);
    }
  }
  return base + '?' + pArray.join('&') + '#wechat_redirect';
}

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
            appId: res.appId,
            "timeStamp": res.timeStamp,
            "nonceStr": res.nonceStr,
            "signature": res.signature,
            success: function(authUser){
              // var authUser = authResult.user;
              //  从authServer获取到用户数据后进行登录
              rsqAdapterManager.ajax.post(rsqConfig.apiServer + 'task/j_spring_security_check', {
                j_username: authUser.rsqUsername, j_password: authUser.rsqPassword, _spring_security_remember_me: true
              }, function(result){
                var resJson = JSON.parse(result);
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
    // rsqChk(params.success, [{}]);
  },
  init: function(params){
    wx.config({
      beta: true,  // 必须这么写，否则在微信插件有些jsapi会有问题
      debug: false,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: params.appId,  // 必填，企业微信的cropID
      timestamp: params.timeStamp, //  必填，生成签名的时间戳
      nonceStr: params.nonceStr,  // 必填，生成签名的随机串
      signature: params.signature,  // 必填，签名，见[附录1](#11974)
      // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      jsApiList: ['getNetworkType']
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
        var oauthUrl = getOauthUrl();
        alert(oauthUrl);
        window.location.href = oauthUrl;
      }
    });
    wx.error(function(err){
      //  如果是config:fail，那么就刷新jsapi ticket
      if(err['errMsg'] === 'config:fail'){
        alert(JSON.stringify(err));
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
    // console.log(params.message)
  },
  setTitle: function(params){
    document.title = params.title;
  },
  setOptionButtons: function(params){
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
  },
  /**
   * 隐藏加载库
   * @param params.onSuccess
   * @param params.onFail
   */
  hideLoader: function(params){
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
  },
  selectDeptMember: function(params){
  },
  selectMember: function(params){
  },
  picker: function(params){
  },
  datePicker: function(params){
  },
  timePicker: function(params){
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
})
