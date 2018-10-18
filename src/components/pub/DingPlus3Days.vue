<template>
  <div class="alert">
    <img class="alert-img" src="../../assets/img/alertplus.svg">
    <div class="alert-text">到期提醒</div>
    <div class="alert-text2">您的使用期限仅剩余{{day}}天，请及时购买/续费 避免因到期停用而影响您的正常工作</div>
    <a href="#" class="buy">前往续费</a>
    <a href="#" class="go">继续试用</a>
    <div class="foot">
      <img src="../../assets/img/code.png" class="code">
      <div class="tips">长按识别二维码，为您解答疑惑</div>
      <div class="phone"><img src="../../assets/img/phone.svg"> <a href="tel:177-1037-6397">177-1037-6397</a></div>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'dingplus3days',
    data () {
      return {
        day: 0
      }
    },
    computed: {
    },
    methods: {
    },
    mounted () {
      this.day = this.$route.query.day
    }
  }
</script>
<style lang="scss" scoped>
  .alert{
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
