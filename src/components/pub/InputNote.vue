<template>
  <v-touch @tap="switchToNote">
    <div
      id="noteEditable"
      ref="elementNote"
      :class="{'content-color': !!content, 'space-padding': hasLeftSpace}"
      class="desp editor-style default-padding default-color space-padding">
      添加任务描述...
    </div>
  </v-touch>
</template>
<script>
  export default {
    name: 'InputNote',
    props: {
      //  是否有左侧的空间，默认是没有的，匹配title没有checkbox的样式；如果title有checkbox，那么需要设置为true
      hasLeftSpace: {
        type: Boolean,
        default: false
      },
      content: {
        type: String,
        default: ''
      },
      //  是否被禁用编辑
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    watch: {
      content (newContent) {
        if (newContent) {
          this.$refs.elementNote.innerHTML = newContent
        }
      }
    },
    methods: {
      switchToNote () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        this.$router.push('/' + this.todoType + '/todo/note')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .desp{
    margin-bottom: 20px;
    padding-top:0.193rem ;
    padding-bottom: 0.293rem;
    padding-right: 0.3rem;
    line-height: 0.586rem;
    font-family: PingFangSC-Regular;
    font-size: 0.373rem;
    letter-spacing: 0;
    background-color: white;
    min-height:0.586rem;
  }
  .default-color{
    color: #A5A5A5;
  }
  .default-padding{
    padding-left: 0.3rem;
    min-height: 54px;
    overflow: auto;
  }
  div.content-color{
    color: #333333
  }
  div.space-padding{
    padding-left: 15px;
    // border-bottom: 0.5px solid #D4D4D4;
  }
  div.space-padding:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 19px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>
