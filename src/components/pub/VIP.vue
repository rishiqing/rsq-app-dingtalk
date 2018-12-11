<template>
  <div class="vip">
    <img class="logo" src="../../assets/img/viplogo.svg">
    <div class="title">功倍VIP专属用户顾问</div>
    <img src="../../assets/img/Group2.png" class="code">
    <div class="text">长按添加专属用户顾问</div>
    <div class="border"></div>
    <div class="text2">我们会为您提供以下服务</div>
    <div class="fw">
      <div class="c"><div class="one"><img src="../../assets/img/one.svg"></div> <div class="text3">业务流程梳理</div></div>
      <div class="c"><div class="one"><img src="../../assets/img/two.svg"></div> <div class="text3">业务流程梳理</div></div>
      <div class="c"><div class="one"><img src="../../assets/img/three.svg"></div> <div class="text3">业务流程梳理</div></div>
    </div>
    <div class="phone"><div class="p">联系电话</div><div class="p2">189-1108-5566</div></div>
  </div>
</template>
<script>
  export default {
    name: 'VIP',
    data () {
      return {
      }
    },
    computed: {
      code () {
        return this.$store.state.plus.saleQrCodeUrl
      },
      phone () {
        return this.$store.state.plus.salePhoneNumber
      }
    },
    methods: {
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '联系专属用户顾问'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    }
  }
</script>
<style lang="scss" scoped>
  .vip{
    position: relative;  
    width: 100%;
    min-height: calc(100% - 60px);
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px; 
    .logo{
      display: block;
      width: 56px;
      height: 56px;
      margin: 0 auto;
    }
    .title{
      height:16px;
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(61,61,61,1);
      line-height:16px;
      margin-top: 21px;
      text-align: center;
    }
    .code{
      margin: 0 auto;
      width: 167px;
      height: 167px;
      margin-top: 18px;
      display: block;
    }
    .text{
      margin-top: 18px;
      text-align: center;
      height:16px;
      font-size:16px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(69,140,218,1);
      line-height:16px;
    }
    .border{
      margin: 0 auto;
      margin-top: 28px;
      width:308px;
      height:1px;
      background-color: rgba(151,151,151,1);
    }
    .text2{
      margin-top: 28px;
      text-align: center;
      height:16px;
      font-size:16px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(61,61,61,1);
      line-height:16px;
    }
    .fw{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 308px;
      margin: 0 auto;
      margin-top: 30px;
      .text3{
        margin-top: 12px;
        text-align: center;
        height:18px;
        font-size:13px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(61,61,61,1);
        line-height:18px;
      }
      .one{
        margin: 0 auto;
        width:47px;
        height:47px;
        background:rgba(54,176,255,1);
        box-shadow:0px 2px 5px 0px rgba(0,0,0,0.2);
        border:3px solid rgba(255,255,255,1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .phone{
      margin-top: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      .p{
        height:18px;
        font-size:13px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(61,61,61,1);
        line-height:18px;
      }
      .p2{
        height:18px;
        font-size:13px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(85,168,253,1);
        line-height:18px;
        margin-left: 9px;
      }
    }

  }
</style>
