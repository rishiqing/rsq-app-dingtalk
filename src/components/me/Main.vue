<template>
  <div class="">
  <div class="top">
    <div class="tupian">
    <avatar :src="loginUser.authUser.avatar"
            :username="loginUser.authUser.name"
            :size="73"></avatar>
    </div>
    <p class="xingming">{{loginUser.authUser.name}}</p>
  </div>
  <div class="bottom">
    <div>
      <v-touch @tap="SwitchToIntroduction">
        <p>更新说明</p>
        <i class="icon2-arrow-right-small arow"></i>
      </v-touch>
    </div>
    <div>
        <p>联系我们</p>
        <span class="tel">010-57294778</span>
    </div>
    <div>
      <v-touch  @tap="gotokefu" :class="{'is-active': '/me' == currentPath}">
      <p>在线客服</p>
        <i class="icon2-arrow-right-small arow"></i>
      </v-touch>
    </div>
    <div>
      <p>电脑访问日事清</p>
      <i class="icon2-arrow-right-small arow"></i>
    </div>
  </div>
  </div>
</template>
<script>
  import Avatar from 'com/pub/TextAvatar'

  export default {
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
    components: {
      'avatar': Avatar
    },
    methods: {
      SwitchToIntroduction () {
        this.$router.push('/pub/explain')
      },
      gotokefu () {
        this.$router.push('/me/kefu')
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.titleName})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: true})
    }
}
</script>
<style scoped >
  .xingming{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0.36px;
    padding-top: 15px;
    margin-left: 7px;
  }
  .top{
    text-align: center;
    height: 200px;
    background-color:#3E86D6;
  }
  .top p{
    margin-top:5px;
  }
  .tupian{
    display: inline-block;
    border-radius: 100px;
    width: 65px;
    height: 65px;
    margin-top: 47px;
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
    color: #55A8FD;
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
