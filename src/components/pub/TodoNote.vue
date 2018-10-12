<template>
  <div>
    <div class="descrip-before" />
    <div
      ref="todoNote"
      class="descrip"
      contenteditable="true"
      @focus="inputFocus"
      @input="inputChange"
      @blur="inputBlur" />
    <div class="descrip-after" />
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          href="javascript:;"
          class="weui-btn weui-btn_primary"
          @tap="submit">
          完成
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  const DEFAULT_NOTE = '<span style="color:#ccc">输入任务描述</span>'

  export default {
    name: 'TodoNote',
    data () {
      return {}
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      note () {
        return this.currentTodo.pNote
      },
      isOriginalEmpty () {
        const str = this.note ? this.note.trim() : ''
        return str === ''
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '任务描述'})
      const noteElement = this.$refs.todoNote
      noteElement.innerHTML = this.isOriginalEmpty ? DEFAULT_NOTE : this.note
    },
    methods: {
      checkCurrentEmpty () {
        const content = this.$refs.todoNote.innerHTML.trim()
        return content === DEFAULT_NOTE || content === ''
      },
      inputFocus () {
        if (this.checkCurrentEmpty()) {
          this.$refs.todoNote.innerHTML = ''
        }
      },
      inputChange () {},
      inputBlur () {
        if (this.checkCurrentEmpty()) {
          this.$refs.todoNote.innerHTML = DEFAULT_NOTE
        }
      },
      submit () {
        if (this.checkCurrentEmpty()) {
          this.$router.go(-1)
          return
        }
        const inputHTML = this.$refs.todoNote.innerHTML.trim()
        const params = {pNote: inputHTML}
        this.$store.dispatch('postNote', params).then(() => {
          this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
          this.$router.go(-1)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .descrip{
    // border-top: 0.5px solid #d4d4d4;
    margin-top: 10px;
    padding: 3%;
    line-height: 0.7rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    letter-spacing: 0;
    background-color: white;
    height: 200px;
    overflow-y: auto;
    box-sizing: border-box;
    outline: none;
    position: relative;
    // border-bottom: 0.5px solid #d4d4d4;
  }
  .descrip-before{
    height: 0;
    position: relative;
  }
  .descrip-after{
    height: 0;
    position: relative;
  }
  .descrip-before:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .descrip-after:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .editable-blank{
    color: #A5A5A5;
  }
</style>
