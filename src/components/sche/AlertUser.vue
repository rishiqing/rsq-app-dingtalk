<template>
  <div class="mask-alert">
    <v-touch class="mask" @tap="close" ref="close">
    </v-touch>
      <div class="alert" ref="stop">
        <img src="../../assets/img/user.png">
        <div class="title">VIP专属用户顾问</div>
        <div class="text">
          我们会为您提供一次专业的远程演示，方便您快速了解如何使用「功倍」。现在领取赠送限时服务礼包。
        </div>
        <v-touch @tap="watchVer" class="bottom">领取权益</v-touch>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'AlertUser',
    data () {
      return {
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      close (e) {
        this.$emit('alert-change', false)
      },
      watchVer () {
        this.$emit('alert-change', false)
        this.$router.push('/vip')
      }
    }
  }
</script>
<style lang="scss" scoped>
.mask-alert{
  width: 100%;
  height: 100%;
  position: relative;
}
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background:rgba(0,0,0,0.2);
    z-index: 999999999999;
  }
    .alert{
      position: fixed;
      background:rgba(255,255,255,1);
      border-radius:10px;
      top: 68px;
      width: 291px;
      height: 372px;
      overflow: hidden;
      z-index: 999999999999999999;
      left: 50%;
      margin-left: -145px;
      img{
        width: 100%;
        vertical-align: center;
      }
      .title{
        margin-top: 15px;
        text-align: center;
        height:26px;
        font-size:19px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(61,61,61,1);
        line-height:26px;
      }
      .text{
        margin: 0 24px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(61,61,61,1);
        line-height:20px;
        margin-top: 9px;
      }
      .bottom{
        margin-top: 47px;
        height:46px;
        font-size:17px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(70,125,185,1);
        line-height:46px;
        text-align: center;
        border-top: 0.5px solid rgba(217,217,217,1);
      }
    }

</style>
