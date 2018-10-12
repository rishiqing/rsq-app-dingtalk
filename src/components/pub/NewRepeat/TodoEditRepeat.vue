<!-- eslint-disable -->
<template>
  <div class="repeat">
    <ul>
      <v-touch
        tag="li"
        v-for="(i, index) in defaultRepeat"
        :key="index"
        @tap="toggleRepeat(i)">
        <span>{{i.value}}</span>
        <i
        v-if="i.checked"
        class="icon2-selected finish"/>
      </v-touch>
    </ul>
    <ul>
      <v-touch
        tag="li"
        @tap="custom">
        <span>自定义重复</span>
        <i class="el-icon-arrow-right repeat-right"></i>
        <span class="rrule-text">{{rruleText}}</span>
      </v-touch>
    </ul>
    <div class="btn-group">
      <v-touch
        class="btn-accept"
        @tap="accept">
        完成
      </v-touch>
    </div>
  </div>
</template>
<script>
  // eslint-disable
  import moment from 'moment'
  import selectRepeat from './SelectUserRepeat'
  import dateUtil from '../../../utils/dateUtil.js'

  export default {
    name: 'TodoEditRepeat',
    data () {
      return {
        adapterWeek: ['RRule.SU','RRule.MO','RRule.TU','RRule.WE','RRule.TH','RRule.FR','RRule.SA'],
        repeatWeekText:['SU','MO','TU','WE','TH','FR','SA'],
        repeatWeekAdapter: ['日', '一', '二', '三', '四', '五', '六'],
        defaultRepeat: [
          {value: '不重复', rrule: '', checked: false},
          {value: '每天重复', rrule: 'FREQ=DAILY', checked: false}
        ],
        defaultFlag: false,
        customrule: '',
        type: null,
        repeatArr: null,
        repeatWeekArr: null,
        until: null,
        rruleText: ''
      }
    },
    computed: {
      rrule () {
        return this.$store.state.todo.currentTodo.rrule || ''
      },
      item() {
        return this.$store.state.todo.currentTodo
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '设置重复'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      var that = this
      // console.log(this.$rrule.fromString("FREQ=DAILY;UNTIL=20180301T160000Z").origOptions)
      this.weekRepeat()
      this.monRepeat()
      this.yearRepeat()
      this.workRepeat()
      // var res = new this.$rrule({
      //   freq: that.$rrule.WEEKLY,
      //   interval: 5,
      //   byweekday: [that.$rrule.MO, that.$rrule.FR],
      //   dtstart: new Date(2012, 1, 1),
      //   until: new Date(2012, 12, 30)
      // })
      this.findDefualt()
      this.findCustom()
      if (this.customrule) {
        var rruleObj = that.$rrule.fromString(that.item.rrule).origOptions
        that.rruleText = dateUtil.rruleToText(rruleObj,that.item.startDate)
      }
    },
    methods: {
      accept() {
        this.$router.go(-1)
      },
      weekRepeat () {
        var that = this
        let week = new Date().getDay() 
        let rrule = new this.$rrule({
          freq: that.$rrule.WEEKLY,
          byweekday: [that.$rrule[that.repeatWeekText[week]]]
        })
        let obj = {
          value: `每周重复（每周${that.repeatWeekAdapter[week]})`,
          rrule: rrule.toString(),
          checked: false
        }
        this.defaultRepeat.push(obj)
      },
      monRepeat () {
        var that = this
        let day = new Date().getDate()  
        let rrule = new this.$rrule({  
          freq: that.$rrule.MONTHLY,
          bymonthday: [day]
          })
        let obj = {
          value: `每月重复（每月${day}日)`,
          rrule: rrule.toString(),
          checked: false
        }
        this.defaultRepeat.push(obj)
      },
      yearRepeat () {
        var that = this
        let day = new Date().getDate()
        let mon = new Date().getMonth() + 1
        let rrule = new this.$rrule({  
          freq: that.$rrule.YEARLY,
          interval: 1
          })
        let obj = {
          value: `每年重复（每年${mon}月${day}日)`,
          rrule: rrule.toString(),
          checked: false
        }
        this.defaultRepeat.push(obj)
      },
      workRepeat () {
        var that = this  
        let rrule = new this.$rrule({
          freq: that.$rrule.WEEKLY,
          byweekday: [that.$rrule.MO,that.$rrule.TU,that.$rrule.WE,that.$rrule.TH,that.$rrule.FR]
        })
        let obj = {
          value: `每个工作日重复（每周一至周五)`,
          rrule: rrule.toString(),
          checked: false
        }
        this.defaultRepeat.push(obj)
      },
      findDefualt () {
        for (let i = 0,len = this.defaultRepeat.length; i < len; i++) {
          this.defaultRepeat[i].checked = false
          if (this.rrule === this.defaultRepeat[i].rrule) {
            this.defaultRepeat[i].checked = true
            this.defaultFlag = true
            this.rruleText = ''
          }
        }
        if (!this.defaultFlag) {
          this.customrule = this.rrule
        }
      },
      custom () {
        this.findDefualt()
        this.findCustom()
        var that = this
        selectRepeat.show({
          // 当前史时间戳
          baseNumTime: new Date().getTime(),
          // 重复类型
          repeatType: this.type || 'everyDay',
          // 月重复时间
          repeatStrTimeArray: this.repeatArr || [new Date().getDate()],
          // 周重复时间
          repeatWeekArray: this.repeatWeekArr || [this.adapterWeek[new Date().getDay()]],
          // 结束时间，null或者不标准的都是永不结束
          repeatOverDate: this.until,
          success: function (result) {
            that.$store.commit('SAVE_CURRENT_RRULE',{rrule: result})
            var rruleObj = that.$rrule.fromString(that.item.rrule).origOptions
            that.rruleText = dateUtil.rruleToText(rruleObj,that.item.startDate)
            that.until = rruleObj.until
            that.findDefualt()
            that.findCustom()

            // that.findCustom()
            // if (result.repeatType) {
            //   that.selected = null
            // }
            // that.uRepeatType = result.repeatType
            // that.uRepeatStrTimeArray = result.repeatStrTimeArray
            // that.uIsLastDate = result.isLastDate
            // that.uRepeatOverDate = result.repeatOverDate
          }
        })
      },
      findCustom () {
        var that = this
        if (this.customrule) {
          var origOptions = this.$rrule.fromString(this.customrule).origOptions
          this.until = origOptions.until
          if (origOptions.freq === 0) {
            this.type = 'everyYear'
          } else if (origOptions.freq === 1) {
            this.type = 'everyMonth'
          } else if (origOptions.freq === 2) {
            this.type = 'everyWeek'
          } else if (origOptions.freq === 3) {
            this.type = 'everyDay'
          }
          if (origOptions.bymonthday) {
            this.repeatArr = origOptions.bymonthday
          }
          if (origOptions.byweekday) {
            this.repeatWeekArr = origOptions.byweekday.map(function (o) {
              return that.adapterWeek[o.weekday + 1]
            })
          }
      } 
        // var strTimeArray = this.uRepeatStrTimeArray
        // if (strTimeArray.length === 0) {
        //   strTimeArray = [moment(this.baseNumTime).format('YYYYMMDD')]
        // }

      },
      toggleRepeat(i) {
        this.customrule = ''
        for (let i = 0, len = this.defaultRepeat.length; i < len; i++) {
          this.defaultRepeat[i].checked = false
        }
        i.checked = true
        this.$store.commit('SAVE_CURRENT_RRULE',{rrule: i.rrule})
        this.rruleText = ''
        this.until = null
      }
    },
    watch: {
      rrule () {
        this.findDefualt()
        this.findCustom()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .repeat{
    ul{
      width: 100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 0.5px 0px 0px rgba(217,217,217,1),0px -0.5px 0px 0px rgba(217,217,217,1);
      padding-left: 15px;
      padding-right: 15px; 
      li{
        width:100%;
        height:56px;
        box-shadow:0px 0.5px 0px 0px rgba(217,217,217,1);
        font-size:17px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(61,61,61,1);
        line-height:56px;
      }
      i{
        float: right;
        height: 56px;
        line-height: 56px;
        margin-right: 15px;
        color: #55A8FD;
        font-size: 15px;
        font-weight: bold;
      }
      .repeat-right{
        color: #C7C7CC;
      }
      .rrule-text{
        color: #C7C7CC;
        margin-right: 10px;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: right;
      }
    }
    .btn-group{
      margin: 30px 15px 0 15px;
      .btn-accept{
        height:46px;
        background:rgba(85,168,253,1);
        border-radius:5px;
        font-size:18px;
        font-family:PingFangSC-Regular;
        color:rgba(255,255,255,1);
        line-height:46px;
        text-align: center;
      }
    }
  }
</style>
