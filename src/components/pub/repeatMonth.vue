<template>
  <div class="repeatMonth">
    <div class="head">
      <v-touch @tap="back">
        <span class="kind-head cancel">取消</span>
      </v-touch>
      <span class="kind-head title">重复日期</span>
      <v-touch @tap="confirm">
        <span class="kind-head cancel">确定</span>
      </v-touch>
    </div>
    <table class="dp-table">
      <tr v-for="weekArray in days">
        <td v-for="day in weekArray" :key="day.date.getTime()">
          <v-touch @tap="tapDay(day)">
          <div class="dp-day" :class="{'dp-selected': day.isSelected}">
            {{ showdate(day)}}
          </div>
          </v-touch>
        </td>
      </tr>
      <!--<div @click="tapDay($event, obj)" class="lastdate">{{obj.text}}</div>-->
    </table>
    <v-touch @tap="last = !last">
      <div class="lastday" :class="{'dp-selected': last}">最后一天</div>
    </v-touch>
    <div class="anotherDay"></div>
    <div class="another-bottom">
      <span class="another-bottom-text">{{final}}</span>
    </div>
  </div>
</template>
<style>
  .anotherDay{
    height: 1.6rem;
    width: 2.85rem;
    position: absolute;
    top:7.92rem;
    left:7.2rem;
    border-right:1px solid #e0e0e0;
    border-bottom:1px solid #e0e0e0
  }
  .dp-table{
    border-bottom: 1px solid #e0e0e0;
  }
  .lastday{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3D3D3D;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.6rem;
    width: 2.85rem;
    position: absolute;
    top:7.92rem;
    left:4.34rem;
    border-right:1px solid #e0e0e0;
    border-bottom:1px solid #e0e0e0
  }
  div.dp-selected{
    background: #3B9BFB;
    color:white
  }
  .repeatMonth td{
    border-right: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  .repeatMonth div.dp-day{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3D3D3D;
    width: 1.4rem;
    height: 1.56rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
  import dateUtil from 'ut/dateUtil'
  export default {
    data () {
      return {
        days: [],
        last: false
      }
    },
    props: {
      kind: String
    },
    computed: {
      final () {
        return this.$store.state.final
      },
      repeat () {
        return this.$store.state.repeat
      }
    },
    methods: {
      confirm () {
//        console.log(JSON.stringify(this.$store.state.repeatMonth))
        this.$store.state.repeatMonth.length = 0
//        this.$store.state.repeatMonth.splice(0, this.$store.state.repeatMonth.length)
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
//            console.log(JSON.stringify(this.days[i][j]))
            if (this.days[i][j]) {
              if (this.days[i][j].isSelected) {
//                console.log(JSON.stringify(this.days[i][j]))
                this.$store.state.repeatMonth.push(this.days[i][j].date)
              }
            }
          }
        }
        if (this.last) {
          this.$store.state.repeat['isLastDate'] = true
          this.$store.state.repeatMonth.push({text: '最后一天'})
        } else {
          this.$store.state.repeat['isLastDate'] = false
        }
        this.$store.commit('SAVE_REPEAT_MONTH')
        this.$emit('hideMonth')
      },
      back () {
        this.$emit('hideMonth')
      },
      initdata () {
        this.days = dateUtil.getMonthDaysByMyself()
        var flag = 1
        var month = this.$store.state.repeatMonth
        if (month && month.length > 0) {
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 7; j++) {
              if (this.days[i][j]) {
                for (var k = 0; k < month.length; k++) {
                  if (new Date(month[k]).getTime() === this.days[i][j].date.getTime()) {
                    this.days[i][j].isSelected = true
                    flag = 0
                  }
                }
              }
            }
          }
        }
        if (flag === 1) {
          for (i = 0; i < 5; i++) {
            for (j = 0; j < 7; j++) {
//              console.log(JSON.stringify(this.days[i][j]))
              if (this.days[i][j]) {
                if (this.days[i][j].date.getDate() === new Date().getDate()) {
                  this.days[i][j].isSelected = true
                  month.push(this.days[i][j].date)
                }
              }
            }
          }
          this.$store.commit('SAVE_REPEAT_MONTH')
        }
        if (this.repeat.isLastDate) {
          this.last = true
        }
      },
      showdate (day) {
        if (day.text) {
          return day.text
        } else {
          return day.date.getTime() === this.numToday ? '今' : day.date.getDate()
        }
      },
      tapDay (day) {
        day.isSelected = !day.isSelected
      }
    },
    mounted () {
//      if (this.kind === '每月') {
      this.initdata()
//      }
    }
  }
</script>
