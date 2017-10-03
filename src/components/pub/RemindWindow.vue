<template>
  <div>
    <div class="modal">
    </div>
    <div class="window">
      <div class="window-top">
        <img src="../../assets/img/tanchuang.png" alt="">
      </div>
      <div class="window-middle">
        <p class="window-title">日事清v2.0上线了</p>
        <p class="window-content">1现在创建任务的时候可以发DING<br/>
          2计划功能挪到pc端了，钉钉日事清pc端稍后上线<br/>
          点击查看更多，了解本次更新全部内容</p>
      </div>
      <div class="window-bottom">
        <v-touch @tap="SwitchTosche">
          <div class="window-left">我知道了</div>
        </v-touch>
        <v-touch @tap="SwitchToexplain">
          <div class="window-right">查看更多</div>
        </v-touch>
      </div>
    </div>
  </div>
</template>
<style>
  div{
    margin:0;
    padding: 0;
  }
  .modal{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    opacity: 0.4;
    z-index: 99;
  }
  .window{
    width: 7.29rem;
    height: 10.405rem;
    position: fixed;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    z-index: 100;
  }
  .window-top{
    width: 7.29rem;
    height: 5.135rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    /*background-color: #3E86D6;*/
    background-image: linear-gradient(-90deg, #69ACEF 0%, #3E86D6 100%);
  }
  .window-top>img{
    width: 3.67rem;
    height: 3.81rem;
  }
  .window-middle{
    height: 3.918rem;
    background-color: white;
    padding-top: 0.378rem;
  }
  .window-title{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #222222;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 10px;
  }
  .window-content{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #666666;
    letter-spacing: 0;
    line-height: 20px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .window-left{
    display: inline-block;
    border-right: 1px solid #E0E0E0;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #38ADFF;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.648rem;
    height: 1.351rem;
  }
  .window-right{
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #38ADFF;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.648rem;
    height: 1.351rem;
  }
  .window-bottom{
    border-top: 1px solid #E0E0E0;
    display: flex;
    background-color: white;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      SwitchToexplain () {
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
        this.$router.push('/pub/explain')
      },
      SwitchTosche () {
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
        this.$router.replace('/sche')
      }
    }
  }
</script>
