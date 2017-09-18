<template>
  <div class="outer-date">
    <v-touch class="" @tap="showDatePikcer">
      <span class="date">日期</span>
      <span class="now">{{ dateString }}</span>
      <!--<span class="now">今天</span>-->
      <i class="icon2-arrow-right-small arrow"></i>
    </v-touch>
  </div>
</template>
<style lang="" scoped>
  .outer-date{
    position: relative;
    height:1.3rem;
    line-height: 1.3rem;
    padding-left:3% ;
    border-bottom:1px solid #E0E0E0;
    width: 100%;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:0.35rem;
    right: 0.1rem;
  }
  .now {
    position: absolute;
    top:0.04rem;
    right: 0.88rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  span{
    display: block;
    /*margin-bottom: 5px;*/
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    /*line-height: 1.458rem;*/
  }
</style>
<script>
  import SelectDate from 'com/pub/SelectDate'
  import dateUtil from 'ut/dateUtil'

  export default {
    data () {
      return {}
    },
    props: {
      itemStartDate: String,
      itemEndDate: String,
      itemDates: String,
      itemSep: String
    },
    computed: {
      dateString () {
        if (!this.itemDates && !this.itemStartDate && !this.itemEndDate) {
          return ''
        }
        var parsed = dateUtil.backend2frontend(this.itemDates, this.itemStartDate, this.itemEndDate)
        // console.log(parsed.currentDate)
        var result = dateUtil.formatDateDisplay(parsed.dateType, parsed.dateResult)
        var now = new Date()
        var month = now.getMonth() + 1
        var day = now.getDate()
        var newdate = month + '月' + day + '日'
        if (newdate === result) {
          return '今天'
        } else {
          return result
        }
      }
    },
    methods: {
      showDatePikcer () {
        // 显示之前先将所有获得焦点的元素失去焦点
        if (document.activeElement) {
          document.activeElement.blur()
        }
        var that = this
        var defDate = dateUtil.backend2frontend(this.itemDates, this.itemStartDate, this.itemEndDate)
        SelectDate.show({
          type: defDate.dateType,
          selectNumDate: defDate.dateResult,
          success: function (result) {
            var resObj = dateUtil.frontend2backend(result.type, result.selectNumDate, that.itemSep)
            that.$emit('date-changed', resObj)
          }
        })
      }
    }
  }
</script>
