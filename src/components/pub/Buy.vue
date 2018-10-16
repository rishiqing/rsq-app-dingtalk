<template>
  <div class="alert">
    <img class="alert-img" src="../../assets/img/alertplus.svg">
    <div class="alert-text">服务已到期</div>
    <div class="alert-text2">您的服务已到期，请及时联系单位管理员前往购买服务</div>
    <a href="#" class="buy">前往购买</a>
    <div class="foot">
      <img src="../../assets/img/code.png" class="code">
      <div class="tips">长按识别二维码，为您解答疑惑</div>
      <div class="phone"><img src="../../assets/img/phone.svg"> <a href="tel:177-1037-6397">177-1037-6397</a></div>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'buy',
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .alert{
    position: relative;  
    width: 100%;
    padding-top: 96px;
    .alert-img{
      display: block;
      margin: 0 auto;
    }
    .alert-text{
      text-align: center;
      height:28px;
      font-size:20px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(79,119,170,1);
      line-height:28px;
      margin-top: 30px;
    }
    .alert-text2{
      padding-left: 15px;
      padding-right: 15px;
      text-align: center;
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(79,119,170,1);
      line-height:22px;
      margin-top: 23px;
    }
    .buy{
      display: block;
      margin: 0 auto;
      width:141px;
      height:36px;
      background:rgba(90,160,232,1);
      border-radius:23px;
      margin-top: 30px;
      font-size:15px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:36px;
      text-align: center;
      cursor: pointer;
    }
    .go{
      display: block;
      margin: 0 auto;
      text-align: center;
      margin-top: 25px;
      width:141px;
      height:36px;
      border-radius:23px;
      border:1px solid rgba(74,144,226,1);
      font-size:15px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(90,160,232,1);
      line-height:36px;
      cursor: pointer;
    }
    .foot{
      position: fixed;
      bottom: 30px;
      width: 100%;
      margin: 0 auto;
    }
    .code{
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 100px;
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
      a{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(85,168,253,1);
        line-height:20px;
      }
    }
  }
</style>
