<template>
  <textarea name="" id="" cols="30" rows="10" class="editTitle" v-model="content"></textarea>
</template>
<style>
  .editTitle{
    height: 4.613rem;
  }
</style>
<script>
  export default {
    data () {
      return {
        content: '',
        flag: 1
      }
    },
    props: {
    },
    computed: {
      title () {
        return this.$store.state.todo.currentTodo.pTitle
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      }
    },
    created () {
      window.rsqadmg.execute('setTitle', {title: '任务标题'})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'submitTodo', name: '确定'}],
        success: function (res) {
          if (res.key === 'submitTodo') {
            that.flag = 0
            if (that.content === that.title) {
              that.$router.replace('/todo/' + that.currentTodo.id)
            } else {
              var params = {pTitle: that.content}
              that.$store.dispatch('updateTodo', {editItem: params})
                .then(() => {
                  that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
                })
                .then(() => {
                  that.$emit('changeTitle', that.content)
                  that.$router.replace('/todo/' + that.currentTodo.id)
//                  this.editItem.pTitle = newTitle
//              this.editItem.pTitle = newTitle
//              window.rsqadmg.exec('hideLoader')
//              window.rsqadmg.execute('toast', {message: '保存成功'})
                })
            }
          }
//          that.$router.replace('/todo/' + that.currentTodo.id)
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    mounted () {
      this.content = this.title
    },
    beforeRouteLeave (to, from, next) {
//      console.log('要返回了')
//      var that = this
      if (this.flag === 1 && this.content !== this.title) {
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
      //  判断是否需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
//      if (to.name === 'sche') {
//        next(false)
//        this.checkIfRepeatEdited(next)
//      } else {
//        return next()
//      }
  }

</script>
