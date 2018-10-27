<template>
  <!--用来测试用的页面，不应用在生产环境中-->
  <div class="init-form">
    <p>发送到聊天测试</p>
    <div class="form">
      <v-touch
        class="form-control"
        @tap="logState">
        <input
          class="u-full-width"
          type="button"
          value="log state">
      </v-touch>
      <v-touch
        class="form-control"
        @tap="showSend">
        <input
          class="u-full-width"
          type="button"
          value="发送到聊天">
      </v-touch>
      <v-touch
        class="form-control"
        @tap="showCorpMessage">
        <input
          class="u-full-width"
          type="button"
          value="发送企业消息">
      </v-touch>
      <v-touch
        class="form-control"
        @tap="showSendRemind(1)">
        <input
          class="u-full-width"
          type="button"
          value="发送提醒（1分钟之后）">
      </v-touch>
      <v-touch
        class="form-control"
        @tap="showSendRemind(3)">
        <input
          class="u-full-width"
          type="button"
          value="发送提醒（3分钟之后）">
      </v-touch>
    </div>
  </div>
</template>
<style lang="scss">
  .init-form {
    position: absolute;left: 10%;width: 80%;top: 20%;background: #f5F5F5;padding: 10px;font-size: 16px;
  }
</style>
<script>
  import util from 'ut/jsUtil'
  export default {
    data () {
      return {
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      }
    },
    methods: {
      logState () {
        console.log(JSON.stringify(this.currentTodo))
        console.log(JSON.stringify(this.currentTodo.clock))
      },
      showSend () {
        var that = this
        window.dd.biz.chat.pickConversation({
          corpId: this.loginUser.authUser.corpId, //  企业id
          isConfirm: 'true', //  是否弹出确认窗口，默认为true
          onSuccess: function (res) {
            //  onSuccess将在选择结束之后调用
            //  该cid和服务端开发文档-普通会话消息接口配合使用，而且只能使用一次，之后将失效
            that.$store.dispatch('sendToConversation', {
              corpId: that.loginUser.authUser.corpId,
              data: {
                sender: that.loginUser.authUser.userId,
                cid: res.cid,
                msgtype: 'oa',
                oa: {
                  message_url: 'https://www.rishiqing.com',
                  head: {
                    text: '头部的标题最多显示5个字符',
                    bgcolor: 'FF55A8FD'
                  },
                  body: {
                    title: '今天开会开个头啊啊啊啊啊来来来来来来来来来来来来，这里好像可以显示很多很多很多！！',
                    form: [
                      {key: '时间：', value: '19:00'},
                      {key: '重要性：', value: '重要且紧急'},
                      {key: '任意设置0-kkkkkkkk：', value: '任意设置0-vvvvvvvvv'},
                      {key: '任意设置1-kkkkkkkk：', value: '任意设置1-vvvvvvvvv'},
                      {key: '任意设置2-kkkkkkkk：', value: '任意设置2-vvvvvvvvv'},
                      {key: '任意设置3-kkkkkkkk：', value: '任意设置3-vvvvvvvvv'},
                      {key: '任意设置4-kkkkkkkk：', value: '任意设置4-vvvvvvvvv'},
                      {key: '任意设置5-kkkkkkkk：', value: '任意设置5-vvvvvvvvv'},
                      {key: '任意设置6-kkkkkkkk：', value: '任意设置6-vvvvvvvvv'}
                    ],
                    rich: {
                      num: '23333',
                      unit: '元'
                    },
                    content: '这是一个非常非常重要的测试任务，不要随便乱点开，我要说的话很多，看看很多文字的话会出现什么效果，文字数量还不够！！！我继续加加加加，继续加继续加，看看能显示多少行多少行，钉钉说只能显示三行，看来能显示很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多',
                    file_count: '2',
                    author: 'Wallace Mao'
                  }
                }
              }
            }).then(res => {
              if (res.errcode !== 0) {
                alert('发送失败：' + JSON.stringify(res))
              } else {
                alert('发送成功！')
              }
            })
          },
          onFail: function (e) {
            alert(JSON.stringify(e))
          }
        })
      },
      showCorpMessage () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
        window.rsqadmg.exec('selectDeptMember', {
          btnText: '确定',  //  选择器按钮文本，pc端需要的参数
          multiple: true, //  默认false，选择单人
          maximum: -1,  //  可选择人数的上限，默认-1不限制人数
          title: that.selectTitle, //  选择器标题，pc端需要的参数
          corpId: corpId,  //  加密的企业 ID，
          selectedIds: [],
          disabledIds: [], //  不能选的人
          success (res) {
//            var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
//              that.memberList = res

            var data = {
              msgtype: 'oa',
              msgcontent: {
                message_url: 'https://www.rishiqing.com',
                head: {
                  text: '头部的标题最多显示5个字符',
                  bgcolor: 'FF55A8FD'
                },
                body: {
                  title: '日事清系统消息--今天开会开个头啊啊啊啊啊来来来来来来来来来来来来，这里好像可以显示很多很多很多！！',
                  form: [
                    {key: '时间：', value: '19:00'},
                    {key: '重要性：', value: '重要且紧急'},
                    {key: '任意设置0-kkkkkkkk：', value: '任意设置0-vvvvvvvvv'},
                    {key: '任意设置1-kkkkkkkk：', value: '任意设置1-vvvvvvvvv'},
                    {key: '任意设置2-kkkkkkkk：', value: '任意设置2-vvvvvvvvv'},
                    {key: '任意设置3-kkkkkkkk：', value: '任意设置3-vvvvvvvvv'},
                    {key: '任意设置4-kkkkkkkk：', value: '任意设置4-vvvvvvvvv'},
                    {key: '任意设置5-kkkkkkkk：', value: '任意设置5-vvvvvvvvv'},
                    {key: '任意设置6-kkkkkkkk：', value: '任意设置6-vvvvvvvvv'}
                  ],
                  rich: {
                    num: '23333',
                    unit: '元'
                  },
                  content: '这是一个非常非常重要的测试任务，不要随便乱点开，我要说的话很多，看看很多文字的话会出现什么效果，文字数量还不够！！！我继续加加加加，继续加继续加，看看能显示多少行多少行，钉钉说只能显示三行，看来能显示很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多多很多很多很多很多很多很多很多很多很多',
                  file_count: '2',
                  author: 'Wallace Mao'
                }
              }
            }
            var idArray = util.extractProp(res, 'emplId')
            if (idArray.length > 0) {
              data['userid_list'] = idArray.join(',')
            }

            that.$store.dispatch('sendAsyncCorpMessage', {
              corpId: that.loginUser.authUser.corpId,
              data: data
            }).then(res => {
              if (res.errcode !== 0) {
                alert('发送失败：' + JSON.stringify(res))
              } else {
                alert('发送成功！')
              }
            })
          }
        })
      },
      showSendRemind (time) {
        var data = {
          todo_id: '12345',
          mills_array: [new Date().getTime() + time * 60 * 1000],
          remind_array: ['任务还有2分钟开始，请点击查看详情'],
          userid_list: this.loginUser.authUser.userId,
          msgtype: 'oa',
          msgcontent: {
            message_url: 'https://www.rishiqing.com',
            head: {
              text: '日事清',
              bgcolor: 'FF55A8FD'
            },
            body: {
              title: '任务提醒',
              form: [
                {key: '任务名称：', value: '产品设计'},
                {key: '时间：', value: '17:55-18:00'},
                {key: '当前时间：', value: new Date()}
              ]
            }
          }
        }
        this.$store.dispatch('sendRemind', {
          corpId: this.loginUser.authUser.corpId,
          data: data
        }).then(res => {
          if (res.errcode !== 0) {
            alert('发送失败：' + JSON.stringify(res))
          } else {
            alert('发送成功！')
          }
        })
      }
    }
  }
</script>
