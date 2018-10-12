<template>
  <div class="kefu">
    <div class="top">
      <img src="../../assets/img/group-code.png">
      <p>加入日事清钉钉用户群</p>
    </div>
    <div class="bot">
      <p class="fir">使用帮助 · 问题反馈 · 用户交流</p>
      <div class="xian"/>
      <p class="sec">长按识别二维码</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Kefu',
    data () {
      return {
        titleName: '在线客服'
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    }
  }
</script>
<style lang="scss" scoped>
  .xian{
    margin: 0 auto;
    width: 206px;
    border-bottom:1px solid #E0E0E0;
    margin-top:8px;
    margin-bottom: 12px;
  }
  .top{
    background-image: linear-gradient(-90deg, #69ACEF 0%, #3E86D6 100%);
    height: 58%;
  }
  .top p{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FFFFFF;
    margin-top: 7.5px;
  }
  .kefu .top img{
    width:248px;
    height:248px;
    margin-top:60px;
  }
  .kefu .top,.bot{
    text-align: center;
  }
  .kefu .bot p.fir{
    margin-top: 56px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #999999;
  }
  p.sec{
    font-family: PingFangSC-Semibold;
    font-size: 27px;
    color: #3D3D3D;
    line-height: 30px;
    margin-bottom: 86.2px;
  }
</style>
