<template>
<div class="version-all">
  <div class="inner">
    <div class="version">
      <div class="text1">试用版</div>
      <div class="text2">不知道几人的试用版</div>
      <div class="day">到期时间：2018-10-31</div>
    </div>
    <img class="img-table" src="../../assets/img/table.png">
    <img class="img-table" src="../../assets/img/table2.png">
    <div class="code-all">
      <img src="../../assets/img/code.png" class="code">
      <div class="tips">长按识别二维码，为您解答疑惑</div>
      <div class="phone"><img src="../../assets/img/phone.svg"> <span>177-1037-6397</span></div>
    </div>
  </div>
  <div class="foot">
    <v-touch @tap="buy" class="buy">立即续费</v-touch>
  </div>
</div>
</template>
<script>
  export default {
    name: 'Version',
    data () {
      return {
      }
    },
    computed: {
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '收费说明'})
    },
    methods: {
      buy () {
        alert('系统升级中')
      }
    }
  }
</script>
<style lang="scss" scoped>
.version-all{
  position: relative;
  width: 100%;
  height: 100%;
}
.inner{
  width: 100%;
  height: calc(100vh - 66px);
overflow: scroll;
 -webkit-overflow-scrolling: touch;    
}
.version{
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 16px;
  height:98px;
  box-shadow:0px 2px 11px 0px rgba(43,136,254,0.16);
  border-radius:3px;
  background-image: url(../../assets/img/Vb.png);
  background-repeat: no-repeat;
  background-position: 100% 100%;
  background-size: 100% 100%;
  overflow: hidden;
  .text1{
    margin-top: 16px;
    margin-left: 16px;
    height:18px;
    font-size:18px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:18px;
  }
  .text2,.day{
    margin-left: 16px;
    margin-top: 10px; 
    height:14px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:14px;
  }
}
.img-table{
  display: block;
 width: calc(100vw - 34px);
 margin: 0 auto;
 margin-top: 11px;
}
.code-all{
  width: 100%;
  margin: 0 auto;
  margin-top: 21px;
  margin-bottom: 94px;
    .code{
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 100px;
      border-radius: 4%;
    }
    .tips{
      margin: 0 auto;
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(155,155,155,1);
      line-height:20px;
      text-align: center;
      margin-top: 10px;
    }
    .phone{
      margin: 0 auto;
      margin-top: 10px;
      display: flex;
      justify-content:center;
      span{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(85,168,253,1);
        line-height:20px;
      }
    }
}
.foot{
  overflow: hidden;
  width:100%;
  background:rgba(255,255,255,1);
  .buy{
    display: block;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 11px;
    margin-bottom: 11px;
    height:44px;
    background:rgba(90,160,232,1);
    border-radius:3px;
    font-size:16px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:44px;
    text-align: center;
  }
}

</style>
