<template>
	<div class="c-bottom-nav z-index-xxxl">
		<div class="row">
			<div class="nav-item u-pull-left">
				<v-touch class="text-icon" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
          <i class="icon2-schedule richeng"></i>
					<span class="icon-title ">日程</span>
				</v-touch>
			</div>

      <v-touch class="float-action-button" @tap="createNew">
        <i class="icon icon-add jiahao" ></i>
      </v-touch>

			<div class="nav-item u-pull-right">
				<v-touch class="text-icon" @tap="reload('/me')" :class="{'is-active': '/me' == currentPath}">
          <i class="icon2-member"></i>

					<span class="icon-title">我</span>

				</v-touch>
			</div>

		</div>

	</div>
</template>
<script>
	export default{
		name: 'Nav',
		data(){
			return{};
		},
    computed: {
		  count () {
		    return this.$store.getters.getCount;
      },
      currentPath () {
        return this.$store.state.sys.currentPath.split('?')[0];
      }
    },
		methods: {
			reload(page){
//        this.$store.dispatch('requestCount', 'aloha')
				this.$router.replace(page);
			},
      createNew(){
        if(this.currentPath == '/sche'){
          this.$router.push('/todo/new/schedule');
        }else if (this.currentPath == '/plan'){
          this.$router.push('/plan/new');
        }else if (this.currentPath == '/doc'){
          this.$router.push('/docSet/new');
        }
      }
		}
	};
</script>
<style scoped>
  @import "../assets/css/variables.scss";
  @import "../assets/fonts/icomoon2.css";
  .c-bottom-nav {
    position: fixed;bottom:0;left:0;right:0;height:49px;
    background: #fff;
    box-shadow: $zDeepShadow2;
  }
  .c-bottom-nav .float-action-button {
    width: 29.6px;
    height: 29.6px;
    background: #4D93DE;
    margin-top: 10.4px;
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 172.5px;
  }
  .jiahao{

  }
  .u-pull-left{
    padding-top: 6.5px;
    margin-right: 65px;
  }
  .u-pull-right{
    padding-top: 6.5px;
    margin-right: 86px;
  }
  .richeng {
     font-size: 25px;
  }
  .wo{
    font-size: 25px;
  }

  .c-bottom-nav .nav-item {
    width: 21%;
  }
  .icon-add{
color:white ;
  }
  .row{
    width: 375px;
    height: 49px;
    background: #FDFDFF;
  }


</style>
