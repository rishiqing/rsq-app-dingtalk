<template>
  <div class="wrap-icon">
    <i class="icon2-arrow-right icon-arrow"></i>
    <!--<i class="icon2-check-box icon-box"></i>-->
    <!--<v-touch>-->
      <!--<span class="content">我是第一个</span>-->
    <!--</v-touch>-->
    <div class="member">我是第er个</div>
  </div>
</template>
<style>
  .icon-arrow .icon-box{
    font-size: 18px;
    display: inline-block;
    float: right;
    margin-left: 20px;
  }
  .wrap-icon{
    border: 1px solid red;
    height: 2rem;
    display: flex;
    align-items: center;
  }
  .content{
    font-size: 22px;
  }
  .member{
    font-size: 22px;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      SwitchToexplain () {
        this.$store.commit('SYS_GUIDE_SHOW', {isShow: false})
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
        this.$router.push('/pub/explain')
      },
      SwitchTosche () {
        this.$store.commit('SYS_GUIDE_SHOW', {isShow: false})
        window.rsqadmg.exec('setItem', this.$store.state.env.version)
      }
    }
  }
</script>
