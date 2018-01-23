<template>
  <div>
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
    <v-touch @tap="last = true">
      <div class="lastday" :class="{'dp-selected': last}">最后一天</div>
    </v-touch>
  </div>
</template>
<style>
  .lastday{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3D3D3D;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.7rem;
    width: 2.9rem;
    position: absolute;
    top:8.9rem;
    left:4.34rem
  }
  div.dp-selected{
    background: #3B9BFB;
    color:white
  }
  td{
    border-right: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  .dp-day{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3D3D3D;
    width: 1.4rem;
    height: 1.46rem;
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
    methods: {
      confirm () {
        this.$store.state.repeatMonth.splice(0, this.$store.state.repeatMonth.length) // 先清空再重新填充数据
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 7; j++) {
//            console.log(JSON.stringify(this.days[i][j]))
            if (this.days[i][j]) {
              if (this.days[i][j].isSelected) {
//                console.log(JSON.stringify(this.days[i][j]))
                this.$store.state.repeatMonth.push(this.days[i][j].date.getDate())
              }
            }
          }
        }
        this.$emit('hideMonth')
      },
      back () {
        this.$emit('hideMonth')
      },
      initdata () {
        this.days = dateUtil.getMonthDaysByMyself()
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
      this.initdata()
    }
  }
</script>
