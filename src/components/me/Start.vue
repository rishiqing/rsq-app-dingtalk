<template>
  <div
    id="splash"
    class="start">
    <div>
      <img
        src="../../assets/img/start.png"
        alt=""
        class="start-img">
      <p class="start-text">欢迎使用日事清 即刻开始享受工作</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Start',
    methods: {
      enterRsq () {
        this.$emit('enter')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .start-text{
    display: flex;
    justify-content: center;
  }
  .start-img{
    width: 8.933rem;
    height: 6.986rem
  }
  .start{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #5EADFD;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1006;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .start-text{
    margin-top: 60px;
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #FFFFFF;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
  }
  .enter-rsq{
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #FFFFFF;
    background: #86DD2F;
    border-radius: 4px;
    cursor: pointer;
    width: 148px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 39px;
  }
</style>
