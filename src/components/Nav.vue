<template>
	<div class="c-bottom-nav z-index-xxxl">
		<div class="row">
			<div class="nav-item u-pull-left">
				<v-touch class="text-icon" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
          <i class="icon2-schedule richeng"></i>
					<span class="wenzi-ri ">日程</span>
				</v-touch>
			</div>
      <v-touch class="float-action-button" @tap="createNew">
        <i class="icon2-add-circle jiahao" ></i>
      </v-touch>
			<div class="nav-item u-pull-right">
				<v-touch class="text-icon" @tap="reload('/me')" :class="{'is-active': '/me' == currentPath}">
          <i class="icon2-member wo"></i>
					<span class="wenzi-wo">我</span>
				</v-touch>
			</div>
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
  .c-bottom-nav {
    position: fixed;bottom:0;left:0;right:0;height:49px;
    background: #fff;
    box-shadow: $zDeepShadow2;
  }
  .c-bottom-nav .float-action-button {
    width: 29.6px;
    height: 29.6px;
    margin-top: 10.4px;
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 172.5px;
  }
  .jiahao{
     color:#4D93DE;
    font-size: 29.6px;
  }
  .u-pull-left{
    padding-top: 6.5px;
    margin-left: 21%;
  }
  .u-pull-right{
    padding-top: 8px;
    padding-bottom: 5px;
    margin-right: 8%;
  }
  .richeng {
     font-size: 25px;
  }
  .wo{
    font-size: 22px;
  }
  .wenzi-ri{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #55A8FD;
    letter-spacing: 0;
    display: block;
    margin-left: 3px;
  }
  .wenzi-wo{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #55A8FD;
    letter-spacing: 0;
    display: block;
    margin-left: 6px;
    margin-top: 3px;
  }
  .c-bottom-nav .nav-item {
    width: 21%;
  }
  .row{
    width: 375px;
    height: 49px;
    background: #FDFDFF;
  }
</style>
