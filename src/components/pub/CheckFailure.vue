<template>
  <div class="check-failure">
    <img src="../../assets/img/deleted1.png" alt="" class="deletedSche">
    <p class="deleted">该日程已被删除</p>
    <v-touch @tap="returnTo">
      <div class="returnTo">返回首页</div>
    </v-touch>
  </div>

</template>
<style>
  .check-failure{
    text-align: center;
    position: absolute;
    top: 50%;
    left:50%;
    margin-top:-2.51rem ;
    margin-left:-1.351rem ;
  }
  .deletedSche{
    width:2.7rem ;
    height:2.7rem ;
  }
  .deleted{
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
    display:flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

</style>
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
  }
</script>
