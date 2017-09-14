<template>
  <div class="bot" style="position: fixed;bottom: 0;left: 0;right: 0;">
      <div class="left">
        <v-touch class="" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
          <i class="icon2-schedule richeng"></i>
          <p class="sche ">日程</p>
        </v-touch>
      </div>
      <div class="mid">
      <v-touch class="" @tap="createNew">
        <i class="icon2-add-circle add" ></i>
      </v-touch>
      </div>
      <div class="right">
        <v-touch class="text-icon" @tap="reload('/me')" :class="{'is-active': '/me' == currentPath}">
          <i class="icon2-member me"></i>
          <p class="my">我</p>
        </v-touch>
      </div>
    </div>
</template>
<script>
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
      }
    },
    methods: {
      reload (page) {
        this.$router.replace(page)
      },
      createNew () {
        this.$router.push('/todo/new/schedule')
      }
    }
  }
</script>
<style scoped>




  .richeng {
     font-size: 25px;
  color:  #999999;;
  }

  .bot{
    border-top:1px solid #CDCDCD;
    height: 1.306rem;
    background-color: #FDFDFF;;
  }

  .richeng{
    font-size: 22px;

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
    bottom:1px;
    padding-bottom:5px;
  }
  .right{
    text-align: center;
    padding-bottom:5px;
    position: absolute;
    right: 2.11rem;
    bottom:1px;
  }
  .mid{
    text-align: center;
    padding-top: 3px;


  }
  .add{
    color:#4D93DE;
    font-size: 29.6px;


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
