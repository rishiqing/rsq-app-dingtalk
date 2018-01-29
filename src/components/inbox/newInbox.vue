<template>
  <input type="text" v-model="content" placeholder="输入任务标题" class="newInbox">
</template>
<script>
  export default {
    data () {
      return {
        content: ''
      }
    },
    methods: {
      submitTodo () {
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: {pTitle: this.content}, todoType: 'inbox'})
          .then(() => {
            this.content = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
            this.$router.replace('/inbox')
          })
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '新建任务'})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'submitTodo', name: '创建'}],
        success: function (res) {
          if (res.key === 'submitTodo') {
            that.submitTodo()
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    beforeRouteLeave (to, from, next) {
      if (this.content) {
        var arr = ['放弃草稿']
        window.rsqadmg.exec('actionsheet', {
          buttonArray: arr,
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                next()
                break
              default:
                break
            }
          }
        })
      } else {
        next()
      }
    }
  }
</script>
<style>
  .newInbox{
    height: 1.466rem;
    margin-top: 0.4rem;
    padding-left: 0.4rem;
  }
</style>
