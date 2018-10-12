<template>
  <div class="">
    <div class="top">
      <div class="tupian">
        <avatar
          :src="loginUser.authUser.avatar"
          :username="loginUser.authUser.name"
          :size="73"/>
      </div>
      <p class="xingming">{{ loginUser.authUser.name }}</p>
    </div>
    <div class="bottom">
      <div class="me-list">
        <p>联系我们</p>
        <span class="tel">010-57294778</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Avatar from 'com/pub/TextAvatar'

  export default {
    name: 'MeMain',
    components: {
      'avatar': Avatar
    },
    data () {
      return {
        titleName: '我'
      }
    },
    computed: {
      loginUser () {
        return this.$store.state.loginUser
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: true})
    },
    methods: {
      SwitchToIntroduction () {
        this.$router.push('/pub/explain')
      },
      gotoKefu () {
        this.$router.push('/me/kefu')
      },
      gotoPc () {
        this.$router.push('/me/pc-end')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .me-list{
    display: flex;
    align-items: center;
    height: 1.5rem;
  }
  .xingming{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0.36px;
    padding-top: 0.4rem;
    margin-left: 7px;
  }
  .top{
    text-align: center;
    height:5.33rem;
    background-color:#4F77AA;
  }
  .top p{
    margin-top:5px;
  }
  .tupian{
    display: inline-block;
    border-radius: 100px;
    width: 1.733rem;
    height: 1.733rem;
    margin-top: 1.253rem;
  }
  .bottom{
    padding-left: 0.43rem;
    background: #FFFFFF;
    border-bottom: 1px solid #E3E3E3;
  }
  .bottom>div{
    line-height:1.253rem ;
    border-bottom: 1px solid #E3E3E3;
    color:#E3E3E3;
    position: relative;
  }
  .bottom div:last-child{
    border-bottom: none;
  }
  .bottom p{
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #222222;
    line-height: 22px;
  }
  .tel{
    position: absolute;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #4F77AA;
    letter-spacing: -0.36px;
    right: 0.4rem;
    top: 0.19rem;
  }
  .arow{
    font-size: 20px;
    position: absolute;
    color:#999999;
    right: 0.2rem;
    top: 0.49rem;
  }
</style>
