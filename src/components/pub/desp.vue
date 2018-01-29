<template>
    <div id="noteEditable" contenteditable="true" class="descrip"
         :class="{'editable-blank': isBlank,'edit-color': remindColor}"
         name="note" rows="5"
         @focus="inputFocus"
         @input="inputChange">输入任务描述</div>
</template>
<script>
  export default {
    name: 'desp',
    // 定义数据
    data () {
      return {
        noteChangeTimes: 0,  // 用来标记note变化的次数，只有第一次改变的时候才被watch监控
        DEFAULT_NOTE: this.pNote,
        isBlank: true,    // 标记是否为空
        flag: 1
      }
    },
    computed: {
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      remindColor () {
        var noteElement = document.getElementById('noteEditable')
        if (noteElement.innerHTML === '输入任务描述') {
          return true
        }
      }
    }, // 定义事件
    methods: {
      inputFocus () {
        if (this.isBlank) {
          var noteElement = document.getElementById('noteEditable')
          if (noteElement.innerHTML === '输入任务描述') {
            noteElement.innerHTML = ''
          }
          this.isBlank = false
        }
      },
      inputChange () {
        var noteElement = document.getElementById('noteEditable')
        this.newItemNote = noteElement.innerHTML
        // this.$dispatch('text-change', this.newItemNote)
      },
      inputBlur () {
        var noteElement = document.getElementById('noteEditable')
        var inputHTML = noteElement.innerHTML
        if (this.flag === 1) {
          this.newItemNote = inputHTML
          this.itemNote = this.newItemNote
          if (inputHTML) {
            this.isBlank = false
          } else {
            this.isBlank = true
            noteElement.innerHTML = this.DEFAULT_NOTE
          }
          var that = this
          var params = {pNote: this.newItemNote}
          console.log('发送过去了')
          this.$store.dispatch('postdesp', params).then(() => {
            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            that.$router.replace(window.history.back())
          })
        } else {
          console.log('进来新建了')
          this.currentTodo.pNote = inputHTML
          console.log(this.currentTodo.pNote)
          this.$router.replace(window.history.back())
        }
      }
    },
    watch: {
      'itemNote': function (newValue) {
        if (typeof newValue === 'undefined') {
          return
        }
        if (this.noteChangeTimes === 0 && newValue) {
          this.noteChangeTimes += 1
          var noteElement = document.getElementById('noteEditable')
          this.newItemNote = newValue
          noteElement.innerHTML = newValue
          this.isBlank = false
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      var noteElement = document.getElementById('noteEditable')
      if (this.flag === 1 && (this.pNote !== noteElement.innerHTML)) {
        var arr = ['放弃草稿']
        window.rsqadmg.exec('actionsheet', {
          buttonArray: arr,
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                next()
                break
              default:
                console.log('取消了')
                break
            }
          }
        })
      } else {
        next()
      }
    },
    beforeRouteEnter (to, from, next) {
      console.log('from是' + from.name)
      if (from.name === 'todoNew') {
        next(vm => {
          vm.flag = 0
        })
      } else {
        next()
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '任务描述'})
      var noteElement = document.getElementById('noteEditable')
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      }
      var that = this
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'senddesp', name: '确定'}],
        success (res) {
          if (res.key === 'senddesp') {
//            that.flag = 0
            that.inputBlur()
          }
        }
      })
    }
  }
</script>
<style>
  .descrip{
    border-top: 1px solid #E0E0E0;
    margin-top: 10px;
    padding: 3%;
    line-height: 0.7rem;
    font-family: PingFangSC-Regular;
    border-bottom: 1px solid #e0e0e0;
    font-size: 17px;
    letter-spacing: 0;
    background-color: white;
    outline: none;
    /*height: 200px;*/
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
  }
  .editable-blank{
    color: #A5A5A5;
  }
</style>
