<template>
  <div class="bot" style="position: fixed;bottom: 0;left: 0;right: 0;">
      <div class="left">
        <v-touch class="left-sche" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
          <i class="icon2-schedule richeng" :class="{'is-active': '/sche' == currentPath}"></i>
          <p class="sche " :class="{'is-active': '/sche' == currentPath}">日程</p>
        </v-touch>
      </div>
      <div class="mid">
        <v-touch class="" @tap="createNew">
          <i class="icon2-add-circle add" ></i>
        </v-touch>
      </div>
      <div class="right">
        <v-touch class="text-icon" @tap="reload('/me')" :class="{'is-active': '/me' == currentPath}">
          <i class="icon2-member me" :class="{'is-active': '/me' == currentPath}"></i>
          <p class="my" :class="{'is-active': '/me' == currentPath}">我</p>
        </v-touch>
      </div>
    </div>
</template>
<script>
  import def from 'ut/defaultUtil'

  export default {
    name: 'Nav',
    data () {
      return {}
    },
    computed: {
      count () {
        return this.$store.getters.getCount
      },
      currentPath () {
        return this.$store.state.sys.currentPath.split('?')[0]
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      }
    },
    methods: {
      reload (page) {
        this.$router.replace(page)
      },
      createNew () {
        //  过去的日期不允许创建任务
        if (this.currentNumDate + 24 * 3600 * 1000 < new Date().getTime()) {
          return window.rsqadmg.exec('toast', {message: '过去的日期不能创建日程'})
        }
        this.$store.dispatch('setCurrentTodo', def.allDefaultTodo())
        this.$router.push('/todo/new/schedule')
      }
    }
  }
</script>
<style scoped>
  .left-sche{
      height:1.306rem;
    /*display: flex;*/
    /*align-items: center;*/
  }
  .text-icon{
    height:1.306rem;
  }
  .is-active{
    color:#55A8FD
  }
  .richeng {
    font-size: 25px;
    color:  #999999;
    /*display: block;*/
  }
  .bot{
    display: flex;
    justify-content: center;
    align-items: center;
    border-top:1px solid #CDCDCD;
    height: 1.306rem;
    background-color: #FDFDFF;;
  }
  .richeng{
    font-size: 22px;
    color: #999999;
    /*display: block;*/
  }
  .sche{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    margin:0;
    padding:0;
    margin-top:-4px;
  }
  .me{
    font-size: 22px;
    color:   #999999;;
  }
  .my{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    margin: 0;
    padding:0;
    margin:0 auto;
    margin-top:-5px;
  }
  .left{
    position: absolute;
    left: 2.053rem;
    bottom:0.168rem;
    padding-bottom:0.026rem;
    height: 1.306rem;
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }
  .right{
    text-align: center;
    padding-bottom:0.026rem;
    position: absolute;
    right: 2.11rem;
    bottom:0.108rem;
    /*height: 1.306rem;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }
  .mid{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.306rem;
  }
  .add{
    color:#4D93DE;
    font-size: 29.6px;
    display: block;
  }
  .bot:after{
    content:'';
    display: block;
    clear: both;
  }
  img{
    width: 1.866rem;
    height: 1.866rem;
    margin-top:3.653rem ;
  }
</style>
