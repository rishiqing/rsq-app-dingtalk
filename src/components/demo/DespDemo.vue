<template>
  <div>
    <!--<div id="noteEditable" contenteditable="true" class="descrip"-->
         <!--:class="{'editable-blank': isBlank}"-->
         <!--name="note" rows="5"-->
         <!--placeholder="输入任务描述"-->
         <!--ref='eleNote'>输入任务描述</div>-->
    <div contenteditable="true" style="width: 100%;height: 100px;border: solid 1px #f00;">hello</div>
  </div>
</template>
<script>
  export default {
    name: 'note',
    // 定义数据
    data () {
      return {
        noteChangeTimes: 0,  // 用来标记note变化的次数，只有第一次改变的时候才被watch监控
        DEFAULT_NOTE: this.pNote,
        isBlank: true    // 标记是否为空
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
        window.alert('focus')
        if (this.isBlank) {
          var noteElement = document.getElementById('noteEditable')
          if (noteElement.innerHTML === '输入任务描述') {
            noteElement.innerHTML = ''
          }
          this.isBlank = false
        }
      },
      inputChange () {
        window.alert('change')
        var noteElement = document.getElementById('noteEditable')
        this.newItemNote = noteElement.innerHTML
        // this.$dispatch('text-change', this.newItemNote)
      },
      inputBlur () {
        window.alert('blur')
        var noteElement = document.getElementById('noteEditable')
        var inputHTML = noteElement.innerHTML
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
        if (this.currentTodo.kanbanId) {
          var newParams = {note: this.newItemNote, id: this.currentTodo.id}
          this.$store.dispatch('updateKanbanItem', newParams).then(() => {
            this.currentTodo.note = this.newItemNote
//            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            that.$router.replace(window.history.back())
          })
        } else {
          this.$store.dispatch('postNote', params).then(() => {
            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            that.$router.replace(window.history.back())
          })
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
          // var noteElement = document.getElementById('noteEditable')
          var noteElement = this.$refs.eleNote
          this.newItemNote = newValue
          noteElement.innerHTML = newValue
          this.isBlank = false
        }
      }
    },
    mounted () {
      // var noteElement = document.getElementById('noteEditable')
      var noteElement = this.$refs.eleNote
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      }
//      var that = this
//      window.rsqadmg.execute('setOptionButtons', {
//        btns: [{key: 'senddesp', name: '确定'}],
//        success (res) {
//          if (res.key === 'senddesp') {
//            that.inputBlur()
//          }
//        }
//      })
    }
  }
</script>
<style>
  .despSubmit{
    margin-top: 0.5rem;
  }
  .descrip{
    border-top: 1px solid #E0E0E0;
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
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom:0;*/
  }
  .editable-blank{
    color: #A5A5A5;
  }
</style>
