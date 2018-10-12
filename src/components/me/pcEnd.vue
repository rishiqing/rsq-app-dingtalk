<template>
  <div class="explain">
    <div class="explain-top">
      <p class="introduce">登录日事清PC端</p>
      <p class="explain-time">日事清pc端与移动端数据自动同步，可在PC端使用更全面的协作功能，帮助提高企业效率</p>
    </div>
    <div class="explain-bottom">
      <div class="first">
        <p class="explain-title">1.输入www.rishiqing.com进入日事清官网 点击右上角登录</p>
        <div class="explain-img">
          <img
            class="pcEnd-img"
            src="../../assets/img/Group7.png">
        </div>
      </div>
      <div class="second">
        <p class="explain-title">2.选择钉钉扫码登录，并使用钉钉扫描二维码</p>
        <div class="explain-img">
          <img
            class="pcEnd-img"
            src="../../assets/img/Group8.png">
        </div>
      </div>
      <div class="second">
        <p class="explain-title">3.进入日事清，安排计划,分配日程</p>
        <div class="explain-img last">
          <img
            class="pcEnd-img last-picture"
            src="../../assets/img/Group.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'PcEnd',
    data () {
      return {
        titleName: '日事清PC端'
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    }
  }
</script>
<style lang="scss" scoped>
  .pcEnd-img{
    width:7.413rem;
    height: 4.96rem;
  }
  p{
    margin:0;
  }
  .last{
    margin-bottom: 1.706rem;
  }
  .explain{
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: white ;
  }
  .second{
    margin-top: 1.786rem;
  }
  .first{
    margin-top: 0.266rem;
  }
  .explain-top{
    margin-top: 15px;
    border-bottom: 1px solid #E0E0E0;
  }
  .introduce{
    font-family: PingFangSC-Regular;
    font-size: 0.613rem;
    color: #3D3D3D;
    letter-spacing: 0;
  }
  .explain-time{
    font-family: PingFangSC-Regular;
    font-size: 0.4rem;
    color: #B1B1B1;
    letter-spacing: 0;
  }
  .explain-title{
    font-family: PingFangSC-Regular;
    font-size: 0.453rem;
    color: #3D3D3D;
    letter-spacing: 0;
  }
  .explain-content{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #323334;
    letter-spacing: 0;
    line-height: 18px;
    margin-top: 5px;
  }
  .explain-img>img{
    width:7.413rem;
  }
  .explain-img{
    width: 9.32rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.533rem;
  }
</style>
