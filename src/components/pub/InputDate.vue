<template>
  <div class="outer-date">
    <v-touch class="" @tap="gotoDate">
      <span class="date">日期</span>
      <span class="now">{{ dateString }}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </v-touch>
  </div>
</template>
<style lang="" scoped>
  .outer-date{
    display: flex;
    align-items: center;
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E0E0E0;
    border-top:1px solid #E0E0E0;
    background-color: white;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    /*top:0.38rem;*/
    top:50%;
    margin-top: -0.25rem;
    right: 0.2rem;
  }
  .now {
    position: absolute;
    /*top:0.04rem;*/
    top:50%;
    margin-top: -0.63rem;
    right: 0.94rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  .date{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  span{
    display: block;

  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    data () {
      return {}
    },
    props: {
      item: Object,
      sep: String
    },
    computed: {
      dateString () {
        var t = this.item
        if (!t.dates && !t.startDate && !t.endDate) {
          return ''
        }
        var parsed = dateUtil.backend2frontend({
          dates: t.dates,
          startDate: t.startDate,
          endDate: t.endDate,
          repeatType: t.repeatType,
          repeatBaseTime: t.repeatBaseTime
        })
        var result
        if (parsed.dateType === 'repeat') {
          result = dateUtil.repeatDayText(t.repeatType, t.repeatBaseTime.split(',')) + '重复'
        } else {
          result = dateUtil.formatDateDisplay(parsed.dateType, parsed.dateResult)
        }
        var time = new Date()
        var newTime = time.getMonth() + 1 + '月' + time.getDate() + '日'
        console.log(result)
        return newTime === result ? '今天' : result
      }
    },
    methods: {
      gotoDate () {
        //  将需要用到的属性设置到currentTodoDate中
        var c = this.item
        var obj = {
          startDate: c.startDate || null,
          endDate: c.endDate || null,
          dates: c.dates || null,
          repeatType: c.repeatType || null,
          repeatBaseTime: c.repeatBaseTime || null
        }
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: obj})
        this.$router.push('/todoEdit/date')
//        // 显示之前先将所有获得焦点的元素失去焦点
//        if (document.activeElement) {
//          document.activeElement.blur()
//        }
//        var that = this
//        var defDate = dateUtil.backend2frontend({dates: this.itemDates, startDate: this.itemStartDate, endDate: this.itemEndDate})
//        SelectDate.show({
//          type: defDate.dateType,
//          selectNumDate: defDate.dateResult,
//          success: function (result) {
//            var resObj = dateUtil.frontend2backend({dateType: result.type, dateResult: result.selectNumDate, sep: that.itemSep})
//            that.$emit('date-changed', resObj)
//          }
//        })
      }
    }
  }
</script>
