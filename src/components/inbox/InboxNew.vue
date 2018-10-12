<template>
  <div class="top-padding">
    <div class="b-t-b">
      <input
        v-model="inputTitle"
        placeholder="请输入标题"
        class="newinbox">
    </div>
    <textarea
      v-model="newMore"
      placeholder="请输入相关描述"
      class="texrmore"
    />
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="delayCall('saveTodo')">
          创建
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'InboxNew',
    data () {
      return {
        inputTitle: '',
        newMore: ''
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '新建记事'})
    },
    methods: {
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      saveTodo () {
        if (!this.inputTitle || /^\s+$/.test(this.inputTitle)) {
          window.rsqadmg.exec('alert', {message: '请输入标题'})
          return
        }
        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        this.$store.dispatch('submitCreateTodoItem', {newItem: {pTitle: this.inputTitle, pNote: this.newMore}, todoType: 'inbox'})
          .then(() => {
            this.inputTitle = ''
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
            this.$router.go(-1)
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top-padding {
    padding-top: 20px;
  }
  .newinbox{
    outline: none;
    -webkit-appearance: none;
    box-shadow: 0;
    width: 100%;
    height: 26px;
    border: 0;
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    line-height: 24px;
    padding: 15px;
  }
  .texrmore{
    -webkit-appearance: none;
    border: 0;
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
    margin-top: 20px;
    height: 226px;
    resize: none;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    line-height: 24px;
    padding: 15px;
  }
</style>
