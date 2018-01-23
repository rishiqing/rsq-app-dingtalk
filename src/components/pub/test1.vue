<template>
  <div class="repeatWindow" :class="{'come': appear}">
    <div class="firstpage" v-show="main">
      <div class="head">
        <v-touch @tap="hideRepeat">
          <span class="cancel">取消</span>
        </v-touch>
        <span class="title">重复周期</span>
        <v-touch @tap="saveRepeat">
          <span class="confirm">确定</span>
        </v-touch>
      </div>
      <div class="content">
      <v-touch @tap="showkind">
        <div class="first" >
          <span class="repeatStyle">重复方式</span>
          <div class="wrap-content">
            <span class="repeatWord">{{kind}}</span>
            <i class="icon2-arrow-right arrow"></i>
          </div>
        </div>
      </v-touch>
      <v-touch @tap="gotoFrequent">
        <div class="first" v-show="kind === '每周'">
          <span class="repeatStyle">重复频率</span>
          <div class="wrap-content">
          <span class="repeatWord">{{frequency}}</span>
          <i class="icon2-arrow-right arrow"></i>
          </div>
        </div>
      </v-touch>
      <v-touch @tap="toSelect">
        <div class="first" v-show="kind === '每周'||kind === '每月'">
          <span class="repeatStyle">选择日期</span>
        <div class="wrap-content">
          <span class="repeatWord">{{dateText}}</span>
          <i class="icon2-arrow-right arrow"></i>
        </div>
        </div>
      </v-touch>
      <div class="first">
        <span class="repeatStyle">截止日期</span>
        <div class="wrap-content">
        <span class="repeatWord">{{frequency}}</span>
        <i class="icon2-arrow-right arrow"></i>
        </div>
      </div>
      </div>
    </div>
    <repeatKind
      v-show="repeatKind"
      @hideKind="hideKind"
    >
    </repeatKind>
    <repeatWeek
      v-show="repeatWeek"
      @hideWeek="hideWeek"
    >
    </repeatWeek>
    <repeatFrequency
      v-show="repeatFrequency"
      @hideFrequency="hideFrequency"
    >
    </repeatFrequency>
    <repeatMonth
      v-show="repeatMonth"
      @hideMonth="hideMonth"
    >
    </repeatMonth>
  </div>
</template>
<script>
  import repeatKind from 'com/pub/repeatKind'
  import repeatWeek from 'com/pub/repeatWeek'
  import repeatFrequency from 'com/pub/repeatFrequency'
  import repeatMonth from 'com/pub/repeatMonth'
  export default {
    name: 'test1',
    data () {
      return {
        kind: '每天', // 这里是从后台拿数据然后进行赋值
        repeatWeek: false,
        repeatKind: false,
        repeatFrequency: false,
        frequency: '',
        dateSelect: false,
        main: true,
        repeatMonth: false
      }
    },
    components: {
      'repeatKind': repeatKind,
      'repeatWeek': repeatWeek,
      'repeatFrequency': repeatFrequency,
      'repeatMonth': repeatMonth
    },
    props: {
      appear: Boolean
    },
    methods: {
      getResult () {
        //  表示选择的是“不重复”
//        params['isCloseRepeat'] = false
//        params['repeatType'] = this.comRepeat.type
//        params['isLastDate'] = this.comRepeat.isLastDate
//        params['repeatBaseTime'] = this.comRepeat.baseArray.join(',')
//        var strDate = dateUtil.dateNum2Text(this.baseNumTime, '/')
//        params['startDate'] = strDate
//        params['endDate'] = strDate
//        return params
      },
      saveTodoRepeatState () {
        var res = this.getResult()
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: res})
      },
      saveRepeat () {
        this.$emit('hideRepeat')
      },
      hideRepeat () {
        this.$emit('hideRepeat')
      },
      hideMonth () {
        this.repeatMonth = false
        this.main = true
      },
      dateback () {
        this.main = true
        this.dateSelect = false
      },
      toSelect () {
        if (this.kind === '每月') {
          this.main = false
          this.repeatMonth = true
        } else {
          this.main = false
          this.repeatWeek = true
        }
      },
      showkind () {
        this.repeatKind = true
        this.main = false
      },
      hideKind (item) {
        this.repeatKind = false
        this.main = true
        this.kind = item || '每天'
      },
      gotoFrequent () {
        this.repeatFrequency = true
        this.main = false
      },
      hideFrequency (item) {
        this.repeatFrequency = false
        this.main = true
        this.frequency = item
      },
      hideWeek () {
        this.repeatWeek = false
        this.main = true
      }
    },
    computed: {
      dateText () {
        var text = ''
        if (this.kind === '每周') {
          var data = this.$store.state.repeatWeek
          if (data.length > 0) {
            for (var i = 0; i < data.length - 1; i++) {
              text += data[i].week + ','
            }
            text += data[i]
          }
          return text
        } else {
          data = this.$store.state.repeatMonth
          if (data.length > 0) {
            for (i = 0; i < data.length - 1; i++) {
              text += data[i] + ','
            }
            text += data[i]
          }
          return text
        }
      }
    }
  }
</script>
<style>
  .repeatWindow{
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: white;
    bottom: -200px;
    transition: 0.1s;
  }
  div.come{
    bottom: 0;
  }
  .repeatWord{
    margin-right: 5px;
  }
  .wrap-content{
    display: flex;
    align-items: center;
  }
  .content{
    padding: 0 0.5rem;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .firstpage{
  }
  .first{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.5rem;
  }
  .arrow{
    /*transform: rotate(-315deg);*/
    color: rgba(25,31,37,0.28);
    font-size: 16px;
  }
  .repeatStyle{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #3D3D3D;
  }
  .repeatWord{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9B9B9B;
  }
  .title{
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #3D3D3D;
  }
  .cancel, .confirm{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3B9BFB;
  }
  .selectedWeek{
    background-color: #5EADFD;
    color:white !important;
  }
  .weekSelect{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .come{
    bottom: 0;
  }
  .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
  }
  .bottom >div{
    display: flex;
    align-items: center;
  }
</style>
