<template>
  <ul class="comment-list">
    <div class="top">
      <v-touch
        :class="{chose:!more}"
        class="operation"
        @tap="changeState1">讨论</v-touch>
      <v-touch
        :class="{chose:more}"
        class="operation"
        @tap="changeState2">操作记录</v-touch>
    </div>
    <r-record-comment
      v-for="item in recordItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      :more="more"/>
    <r-todo-comment
      v-for="item in commentItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      :more="more"
      @comment-file-touch="delayCallFix"
      @click-comment="handleCommentClick"/>
    <div
      v-if="commentCount && !more"
      class="no-comment">
      <img
        src="../../assets/img/nocomment.png"
        alt="">
      <p class="no-comment-content">暂无评论</p>
    </div>
  </ul>
</template>
<script>
  import Previewer from 'com/pub/Previewer'
  import CommentItem from 'com/pub/CommentItem'
  import CommentRecord from 'com/pub/CommentRecord'
  export default {
    name: 'CommentList',
    components: {
      'r-todo-comment': CommentItem,
      'r-record-comment': CommentRecord
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      items: {
        type: Array,
        required: true
      },
      todoId: {
        required: true
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    data () {
      return {
        more: false
      }
    },
    computed: {
      recordItems () {
        // console.log(this.$store.state.record)
        var arr = this.$store.state.record
        var that = this
        var record = arr.sort(that.compare)
        return record
//        if (this.items) {
//          return this.items.filter(i => {
//            return i.type !== 0
//          })
//        }
      },
      commentItems () {
        return this.items.filter(i => {
          return i.type === 0
        })
      },
      commentCount () {
        if (this.items === undefined) {
          return
        } else {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].type === 0) {
              return false
            }
          }
          return true
        }
      },
      loginUser () {
        return this.$store.state.loginUser
      },
      rsqUserId () {
        return this.loginUser.rsqUser.id
      }
    },
    watch: {
      todoId (newId) {
        if (newId && this.todoType !== 'plan') {
          this.$store.dispatch('getRecord', {id: newId})
        }
      }
    },
    mounted () {
      this.changeState1()
    },
    methods: {
      compare (o1, o2) {
        var val1 = o1.dateCreated
        var val2 = o2.dateCreated
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      },
      getFileName (file) {
        if (!file.name) return ''
        var arr = file.name.split('/')
        return arr[arr.length - 1].substr(14)
      },
      changeState1 () {
        if (this.todoType === 'sche' && this.todoId) {
          this.$store.dispatch('getRecord', {id: this.todoId})
        }
        this.more = false
      },
      changeState2 () {
        this.more = true
      },
      changeState () {
        //  暂时这么处理：日程中的操作记录通过接口获取，计划中的不获取
        if (this.todoType === 'sche') {
          this.$store.dispatch('getRecord', {id: this.todoId})
            .then(() => {
              this.more = !this.more
            })
        } else {
          this.more = !this.more
        }
      },
      delayCallFix (e) {
        window.setTimeout(() => {
          this.showAction(e)
        }, 50)
      },
      showAction (f) {
        if (f.contentType === 'png' || f.contentType === 'jpg' || f.contentType === 'jpeg' || f.contentType === 'bmp' || f.contentType === 'gif') {
          Previewer.show({ file: f })
        } else {
          window.rsqadmg.execute('alert', {message: '该文件类型暂不支持预览'})
        }
        return
        // var that = this
        // const device = window.rsqadmg.exec('checkDevice')
        // if (device.os !== 'iOS') {
        //   var btnArray = ['预览文件', '下载文件']
        //   window.rsqadmg.exec('actionsheet', {
        //     buttonArray: btnArray,
        //     success: function (res) {
        //       switch (res.buttonIndex) {
        //         case 0:
        //           Previewer.show({
        //             file: f
        //           })
        //           break
        //         case 1:
        //           that.downloadFile(f)
        //           break
        //         default:
        //           break
        //       }
        //     }
        //   })
        // }
      },
      downloadFile (f) {
        var link = document.createElement('a')
        link.download = this.getFileName(f)
        link.href = f.realPath
        link.click()
      },
      handleCommentClick (item) {
        const deleteAction = this.todoType === 'plan' ? 'deleteKanbanItemComment' : 'deleteCommentItem'
        const replyAction = this.todoType === 'plan' ? 'replyKanbanItemComment' : 'replyCommentItem'
        var that = this
        if (this.rsqUserId === item.authorId) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此评论？',
            success () {
              that.$store.dispatch(deleteAction, {item: item})
                .then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                })
            }
          })
        } else {
          window.rsqadmg.exec('confirm', {
            message: '确定回复此评论？',
            success () {
              that.$store.dispatch(replyAction, {item: item})
                .then(() => {
                  that.$router.push('/' + that.todoType + '/todo/comment')
                })
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .no-comment{
    text-align: center;
    height: 3rem;
    margin-bottom: 2rem;
  }
  .no-comment>img{
    width: 44px;
    height:44px ;
    margin-top: 1.6rem;
  }
  .no-comment-content{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .isDisplay{
    display: none !important;
  }
  .comment-list{
    background-color: white;
    margin-top: 20px;
    // padding-bottom: 2.9rem;
    border-top: 0.5px solid transparent;
    border-bottom: 0.5px solid transparent;
    position: relative;
  }
  .comment-list:before{
    content: " ";
    position: absolute;
    left: 0;
    top: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .comment-list:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -2px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .operation{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9B9B9B;
    display: inline-block;
    line-height:1.083rem;
    margin-left: 0.333rem;
    width: 72px;
    text-align: center;
    height: 40px;
  }
  .top{
    position: relative;
  }
  .top:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .chose{
    color: #55A8FD;
    border-bottom: 2px solid #55A8FD;
  }
</style>
