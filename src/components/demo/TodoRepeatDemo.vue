<template>
  <div>
    <div class="btn-group" >
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="openRepeat">
          自定义重复
        </v-touch>
      </div>
    </div>
    <div>
      <p>baseNumTime: {{ baseNumTime }}</p>
      <p>repeatType: {{ repeatType }}</p>
      <p>repeatStrTimeArray: {{ repeatStrTimeArray }}</p>
      <p>isLastDate: {{ isLastDate }}</p>
      <p>repeatOverDate: {{ repeatOverDate }}</p>
    </div>
  </div>
</template>

<script>
  import SelectRepeat from 'com/pub/SelectUserRepeat'
  import moment from 'moment'

  export default {
    name: 'TodoRepeatDemo',
    data () {
      return {
        baseNumTime: new Date().getTime(),
        repeatType: 'everyDay',
        repeatStrTimeArray: [moment(this.baseNumTime).format('YYYYMMDD')],
        isLastDate: false,
        repeatOverDate: null
      }
    },
    methods: {
      openRepeat () {
        const that = this
        SelectRepeat.show({ // 这个函数的作用很简单，就是把数据传过来然后把结果数据再传给this,只是这几个属性要好好理解下
          baseNumTime: that.baseNumTime,
          repeatType: that.repeatType || 'everyDay',
          repeatStrTimeArray: that.repeatStrTimeArray,
          isLastDate: that.isLastDate,
          repeatOverDate: that.repeatOverDate,
          success: function (result) {
            that.repeatType = result.repeatType
            that.repeatStrTimeArray = result.repeatStrTimeArray
            that.isLastDate = result.isLastDate
            that.repeatOverDate = result.repeatOverDate
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>
