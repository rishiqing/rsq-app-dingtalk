<template>
    <div id="noteEditable" contenteditable="true" class="descrip"
         :class="{'editable-blank': isBlank}"
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
        isBlank: true    // 标记是否为空
      }
    },
    computed: {
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
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
        this.newItemNote = inputHTML
        this.itemNote = this.newItemNote
        if (inputHTML) {
          this.isBlank = false
        } else {
          this.isBlank = true
          noteElement.innerHTML = this.DEFAULT_NOTE
        }
        var that = this
        this.$store.dispatch('postdesp', {pNote: this.newItemNote}).then(() => {
          that.$router.replace(window.history.back())
        })
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
    mounted () {
      var noteElement = document.getElementById('noteEditable')
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      }
      var that = this
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'senddesp', name: '确定'}],
        success (res) {
          if (res.key === 'senddesp') {
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
    width: 100%;
    line-height: 0.7rem;
    font-family: STHeitiSC-Light;
    font-size: 17px;
    color: black;
    letter-spacing: 0;
    background-color: white;
    height: 200px;
    box-sizing: border-box;
  }
</style>
