<template>
  <v-touch @tap="gotoDate">
    <div
      class="outer-wrap bottom-border">
      <span class="inner-key">{{ dateString }}</span>
    </div>
  </v-touch>
</template>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'SubInputDate',
    props: {
      //  是否有左侧的空间，默认是没有的，编辑模式下是有左边的padding
      hasLeftSpace: {
        type: Boolean,
        default: false
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
      //  todo item对象
      item: {
        type: Object,
        required: true
      },
      //  日期分隔符
      sep: {
        type: String,
        default: ''
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    data () {
      return {}
    },
    computed: {
      dateString () {
        if (this.item.startDate === null && this.item.endDate === null && this.item.dates === null) {
          return '日期'
        } else {
          var result = dateUtil.repeatDate2Text(this.item)
          if (result.length > 20) {
            result = result.substring(0, 18) + '...'
          }
          var time = new Date()
          var newTime = time.getMonth() + 1 + '月' + time.getDate() + '日'
          return newTime === result ? '今天' : result
        }
      },
      fromInbox () {
        return this.item.pContainer === 'inbox'
      }
    },
    methods: {
      gotoDate () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        //  将需要用到的属性设置到currentTodoDate中
        var c = this.item
        var obj = {
          startDate: c.startDate || null,
          endDate: c.endDate || null,
          dates: c.dates || null,
          isCloseRepeat: !!c.isCloseRepeat,
          repeatType: c.repeatType || null,
          repeatBaseTime: c.repeatBaseTime || null,
          isLastDate: c.isLastDate === undefined || false
        }
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: obj})
        this.$router.push('/' + this.todoType + '/todo/subdate')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 56px;
    background-color: transparent;
  }
  .inner-key{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .bottom-border{
    // border-bottom: 1px solid #E0E0E0;
  }
</style>

