<template>
  <div class="mask-alert">
    <v-touch class="mask" @tap="close" ref="close">
    </v-touch>
      <div class="alert" ref="stop">
        <img class="alert-logo" src="../../assets/img/alertlogo.png">
        <div class="title">升级企业版</div>
        <div class="text text1">
          <span>「计划管理」功能目前属于付费版功能。</span>通过看板的形式将计划拆分成多个步骤或子目标，您可以实时了解团队当前工作进展，直观便捷。
        </div>
        <div class="text text2">
          企业版在web端可使用「数据导出」「思维导图」「甘特图」「番茄钟」「office在线编辑」「统计」「自定义权限」等精彩功能。
        </div>
        <v-touch @tap="watchVer" class="bottom">查看收费说明</v-touch>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'MaskAlert',
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
        this.$router.push('/version')
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
    background:rgba(0,0,0,0.2);
    z-index: 9999999;
  }
    .alert{
      position: fixed;
      height:391px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      top: 68px;
      margin-left: 22px;
      margin-right: 22px;
      overflow: hidden;
      z-index: 99999999;
      .alert-logo{
        width: 40px;
        height: 40px;
        display: block;
        margin: 0 auto;
        margin-top: 32px;
      }
      .title{
        height:24px;
        font-size:17px;
        font-family:PingFangSC;
        font-weight:500;
        color:rgba(0,0,0,1);
        line-height:24px;
        text-align: center;
        margin-top: 18px;
        font-weight: bold;
      }
      .text{
        margin: 0 22px;
        font-size:14px;
        font-family:PingFangSC;
        font-weight:600;
        color:rgba(61,61,61,1);
        line-height:20px;
        margin-top: 42px;
        span{
          font-weight: bold;
        }
      }
      .text2{
        margin-top: 21px;
      }
      .bottom{
        margin-top: 51px;
        height:43px;
        font-size:17px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(70,125,185,1);
        line-height:43px;
        text-align: center;
        border-top: 0.5px solid rgba(217,217,217,1);
      }
    }

</style>
