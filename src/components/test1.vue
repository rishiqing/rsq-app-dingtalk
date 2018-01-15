<template>
  <div>
    <div class="firstpage">
    <div class="head">
      <span style="color: red">取消</span>
      <span style="margin: 0 20px">重复周期</span>
      <span style="color: red">确定</span>
    </div>
    <div class="bottom" v-show="mainPage">
      <v-touch @tap="showkind">
        <div class="first" >
          <span>重复------</span>
          <span>{{kind}}</span>
        </div>
      </v-touch>
      <v-touch @tap="gotoFrequent">
        <div class="second" v-show="kind === '每周'">
          <span>重复频率</span>
          <span>{{frequency}}</span>
        </div>
      </v-touch>
      <div class="date-kind" v-show="kind === '每周'||kind === '每月'">
        <span>选择日期</span>
        <span>{{date}}</span>
      </div>
      <div class="four">
        <span>截止日期</span>
        <span>{{frequency}}</span>
      </div>
    </div>
    <div v-show="repeatKind" v-for="item in this.everydata">
      <v-touch @tap="gotokind(item)">
      {{item}}
      </v-touch>
    </div>
    </div>
    <div class="frequent" v-show="repreatFrequent">
      <v-touch @tap="back">
        <span>取消</span>
      </v-touch>
      <span>重复频率</span>
      <ul>
        <li v-for="item in frequentlist">
          <v-touch @tap="changeFrequency">
            {{item}}
          </v-touch>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        kind: '每天', // 这里是从后台拿数据然后进行赋值
        firstpage: true,
        weekKind: false,
        everydata: ['每天', '每周', '每月', '每年'],
        repeatKind: false,
        repreatFrequent: false,
        frequency: '',
        frequentlist: ['每一周', '每两周', '每三周', '没四周'],
        mainPage: true
      }
    },
    methods: {
      showkind () {
        console.log('点击了')
        this.repeatKind = true
      },
      gotokind (item) {
        if (item === '每月') {
          this.kind = '每月'
          this.mainPage = false
        } else if (item === '每周') {
          this.kind = '每周'
          this.mainPage = false
        } else if (item === '每天') {
          this.kind = '每天'
          this.mainPage = false
        } else if (item === '每年') {
          this.kind = '每年'
          this.mainPage = false
        }
      },
      gotoFrequent () {
        this.repreatFrequent = true
        this.firstpage = false
      },
      back () {
        this.repreatFrequent = false
        this.firstpage = true
      },
      changeFrequency (item) {
        this.repreatFrequent = false
        this.frequency = item
      }
    },
    computed: {
    }
  }
</script>
<style>
  .head{
    display: flex;
    align-items: center;
  }
  .bottom >div{
    display: flex;
    align-items: center;
  }
</style>
