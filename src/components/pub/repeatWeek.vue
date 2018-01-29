<template>
  <div class="frequent">
    <div class="head">
      <v-touch @tap="back" class="kind-head">
        <span class="cancel">取消</span>
      </v-touch>
      <span class="title">重复日期</span>
      <v-touch @tap="confirm"class="kind-head"><span class="cancel">确定</span></v-touch>
    </div>
    <ul class="week-list">
      <li v-for="item in weekArray" class="word" :class="{'largeDistance': IsBottom(item), 'topDistance': Islarge(item), 'selectedWeek': item.isSelected}">
        <v-touch @tap="clickWeek(item)">
          <span>{{item.week}}</span>
        </v-touch>
      </li>
    </ul>
    <div class="another-bottom">
      <span class="another-bottom-text">{{final}}</span>
    </div>
  </div>
</template>
<style>
  li.topDistance{
    margin-top: 1rem;
  }
  li.largeDistance{
    margin-left: 2rem;
  }
  .week-list{
    /*display: flex;*/
    /*align-items: center;*/
    /*white-space: normal;*/
    /*justify-content: space-around;*/
    height: 5rem;
    padding-top: 1rem;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
    /*justify-content: flex-start;*/
  }
  .word{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3D3D3D;
    border-radius: 50%;
    border: 1px solid #E0E0E0;
    width: 1.28rem;
    height: 1.28rem;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin-left: 0.9rem;
  }
</style>
<script>
  export default {
    data () {
      return {
        weekArray: [
          {week: '周一', isSelected: false, flag: 1},
          {week: '周二', isSelected: false, flag: 2},
          {week: '周三', isSelected: false, flag: 3},
          {week: '周四', isSelected: false, flag: 4},
          {week: '周五', isSelected: false, flag: 5},
          {week: '周六', isSelected: false, flag: 6},
          {week: '周日', isSelected: false, flag: 7}
        ]
      }
    },
    props: {
      kind: String
    },
    computed: {
      final () {
        return this.$store.state.final
      }
    },
    methods: {
      initdata () {
        var week = this.$store.state.repeatWeek
        if (week && week.length === 0) {
          if (new Date().getDay() === 0) {
            this.weekArray[6].isSelected = true
            this.$store.state.repeatWeek.push({'week': '周日', 'flag': 7})
            this.$store.commit('SAVE_REPEAT_BASETIME')
          } else {
            this.weekArray[new Date().getDay() - 1].isSelected = true
            this.$store.state.repeatWeek.push({'week': this.weekArray[new Date().getDay() - 1].week, 'flag': this.weekArray[new Date().getDay() - 1].flag})
            this.$store.commit('SAVE_REPEAT_BASETIME')
          }
        } else {
          for (var j = 0; j < week.length; j++) {
            for (var i = 0; i < this.weekArray.length; i++) {
              if (week[j].week === this.weekArray[i].week) {
                this.weekArray[i].isSelected = true
              }
            }
          }
        }
      },
      Islarge (item) {
        return item.week === '周五' || item.week === '周六' || item.week === '周日'
      },
      IsBottom (item) {
        return item.week === '周五'
      },
      confirm () {
//        console.log(JSON.stringify(this.$store.state.repeatWeek))
        this.$store.state.repeatWeek.splice(0, this.$store.state.repeatWeek.length)
        for (var i = 0; i < this.weekArray.length; i++) {
          if (this.weekArray[i].isSelected) {
            this.$store.state.repeatWeek.push({'week': this.weekArray[i].week, 'flag': this.weekArray[i].flag})
          }
        }
        this.$store.commit('SAVE_REPEAT_BASETIME')
//        console.log('发过去了')
        this.$emit('hideWeek')
      },
      back () {
        this.$emit('hideWeek')
      },
      clickWeek (obj) {
        obj.isSelected = !obj.isSelected
      }
    },
    mounted () {
//      if (this.kind === '每周') {
      this.initdata()
//      }
    }
  }
</script>
