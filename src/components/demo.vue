<template>
<div>
  <v-touch class='form-control' @tap='doTest'>
    <input class='u-full-width' type='button' value='测试' />
    <!--<p>{{copid}}</p>-->
  </v-touch>
</div>

</template>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      copid () {
        return this.$store.state.loginUser.authUser
      }
    },
    methods: {
      doTest () {
        console.log('进来了')
        window.dd.biz.ding.post({
          users: ['manager5864'], // 用户列表，工号
          corpId: 'dinga5892228289863f535c2f4657eb6378f', // 企业id
          type: 2, // 钉类型 1：image  2：link
          alertType: 2,
          alertDate: {'format': 'yyyy-MM-dd HH:mm', 'value': '2017-09-29 08:00'},
          attachment: {
            title: '',
            url: '',
            image: '',
            text: ''
          },
          text: '', // 消息
          onSuccess: function () {},
          onFail: function () {}
        })
//        window.dd.biz.ding.create({
//          users: ['manager5864'], // 用户列表，工号
//          corpId: 'dinga5892228289863f535c2f4657eb6378f', // 企业id
//          type: 1, // 附件类型 1：image  2：link
//          alertType: 2, // 钉发送方式 0:电话, 1:短信, 2:应用内
//          alertDate: {'format': 'yyyy-MM-dd HH:mm', 'value': '2017-09-25 17:05'},
//          attachment: {
//            images: ['https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png']
//          }, // 附件信息
//          text: '哈哈哈',  // 正文
//          bizType: 0, // 业务类型 0：通知DING；1：任务；2：会议；
//          confInfo: {
//            bizSubType: 0, // 子业务类型如会议：0：预约会议；1：预约电话会议；2：预约视频会议；（注：目前只有会议才有子业务类型）
//            location: '某某会议室', // 会议地点；（非必填）
//            startTime: {'format': 'yyyy-MM-dd HH:mm', 'value': '2017-09-25 17:05'}, // 会议开始时间
//            endTime: {'format': 'yyyy-MM-dd HH:mm', 'value': '2017-09-25 17:05'}, // 会议结束时间
//            remindMinutes: 30, // 会前提醒。单位分钟-1：不提醒；0：事件发生时提醒；5：提前5分钟；15：提前15分钟；30：提前30分钟；60：提前1个小时；1440：提前一天；
//            remindType: 2 // 会议提前提醒方式。0:电话, 1:短信, 2:应用内
//          },
//
//          taskInfo: {
//            ccUsers: ['manager5864'], // 抄送用户列表，工号
//            deadlineTime: {'format': 'yyyy-MM-dd HH:mm', 'value': '2017-09-25 17:05'}, // 任务截止时间
//            taskRemind: 30 // 任务提醒时间，单位分钟0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；
//          },
//          onSuccess: function () {
//            console.log('成功了')
//          },
//          onFail: function (e) {
//            console.log(JSON.stringify(e))
//          }
//        })
//        window.rsqadmg.exec('alert', {
//          message: 'from rsqadmg',
//          title: '我是题目',
//          buttonName: '我是按钮'
//        })
//        window.dd.device.notification.alert({
//          message: '亲爱的',
//          title: '提示', //  可传空
//          buttonName: '收到',
//          onSuccess: function () {
//            //  onSuccess将在点击button之后回调
//          },
//          onFail: function (err) {
//            alert(err)
//          }
//        })
      },
      mounted () {
        console.log(this.copid)
      }
    }
  }
</script>
