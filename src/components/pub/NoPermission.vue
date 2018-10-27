<template>
  <div class="no-permission">
    <img src="../../assets/img/noPermit.png" alt="" class="no-permit-img">
    <p class="no-permit-word">无查看权限</p>
    <v-touch @tap="returnTo">
      <div class="returnTo">返回首页</div>
    </v-touch>
  </div>

</template>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      returnTo () {
        this.$router.replace('/sche')
      }
    }
//    beforeRouteLeave (to, from, next) {
//      this.$router.replace('/sche')
//      next('/sche')
//    }
  }
</script>
<style lang="scss" scoped>
  .no-permission{
    text-align: center;
    position: absolute;
    top: 50%;
    left:50%;
    margin-top:-2.162rem ;
    margin-left:-1.297rem ;
  }
  .no-permit-img{
    width:67px ;
    height:88px ;
  }
  .no-permit-word{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .returnTo{
    background: #55A8FD;
    border-radius: 4px;
    width: 97px;
    height: 35px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0;
    margin: 0 auto;
    display:flex;
    align-items: center;
    justify-content: center;
  }

</style>


