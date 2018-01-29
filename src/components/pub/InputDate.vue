<template>
  <v-touch class="touch-date" @tap="gotoDate" :class="{'hasPadding':newItem}">
    <div class="outer-date":class="{ 'subtodo-border': subNewItem}">
      <i class="icon2-schedule schedule"></i>
      <span class="date" v-show="!editTime">日期</span>
      <span class="now" :class="{'edit-padding-left':editTime}">{{ dateString }}</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </div>
  </v-touch>
</template>
<style lang="" scoped>
  div.subtodo-border{
    border-bottom: none;
  }
  .schedule {
    color: #55A8FD;
    font-size: 18px;
  }
  .outer-date{
    display: flex;
    align-items: center;
    position: relative;
    height:1.3rem;
    line-height: 1.3rem;
    border-bottom:1px solid #E0E0E0;
    /*border-top:1px solid #E0E0E0;*/
    background-color: white;
    /*margin-top: 0.2rem;*/
  }
  .hasPadding{
    border-top:1px solid #E0E0E0;
    padding-left: 3%;
    margin-top: 0.2rem;
    background-color: white;
  }
  .arrow{
    /*color: #999999;*/
    /*font-size: 21px;*/
    color: rgba(25,31,37,0.28);
    font-size: 25px;
    position: absolute;
    /*top:0.38rem;*/
    top:50%;
    margin-top: -0.31rem;
    right: 0.2rem;
  }
  .now {
    position: absolute;
    /*top:0.04rem;*/
    top:50%;
    margin-top: -0.65rem;
    right: 0.94rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
  }
  span.edit-padding-left{
    left:0.8rem;
    color: #272D32;
  }
  .date{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #191F25;
    margin-left: 2.5%;
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
      disabled: Boolean,
      item: Object,
      sep: String,
      editTime: Boolean,
      newItem: Boolean,
      subNewItem: Boolean
    },
    computed: {
      dateString () {
        if (this.item) {
          if (this.item.pContainer === 'inbox') {
            return '添至日程'
          } else {
            var result = dateUtil.repeatDate2Text(this.item)
//          console.log(result.length)
            if (result.length > 20) {
              result = result.substring(0, 21)
            }
            var time = new Date()
            var newTime = time.getMonth() + 1 + '月' + time.getDate() + '日'
            return newTime === result ? '今天' : result
          }
        }
      }
    },
    methods: {
      gotoDate () {
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        //  将需要用到的属性设置到currentTodoDate中
        var c = this.item
        var obj = {
          startDate: c.startDate || null,
          endDate: c.endDate || null,
          dates: c.dates || null,
          repeatType: c.repeatType || null,
          repeatBaseTime: c.repeatBaseTime || null,
          isLastDate: c.isLastDate === undefined || false
        }
        console.log('传过来的时间' + obj.repeatType)
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
    },
    mounted () {
//      console.log('todonew传过来的item是' + JSON.stringify(this.item))
    }
  }
</script>
