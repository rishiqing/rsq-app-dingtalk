<template>
	<div class="c-bottom-nav z-index-xxxl">
		<div class="row">
			<div class="nav-item u-pull-left">
				<v-touch class="text-icon" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
					<i class="icon icon-insert_invitation"></i>
					<span class="icon-title">日程</span>
				</v-touch>
			</div>
			<div class="nav-item u-pull-left">
				<v-touch class="text-icon" @tap="reload('/plan')" :class="{'is-active': '/plan' == currentPath}">
					<i class="icon icon-ic_kanban_black_24px"></i>
					<span class="icon-title">计划</span>
				</v-touch>
			</div>
			<div class="nav-item u-pull-right">
				<v-touch class="text-icon" @tap="reload('/me')" :class="{'is-active': '/me' == currentPath}">
					<i class="icon icon-ic_kanban_black_24px"></i>
					<span class="icon-title">我</span>
				</v-touch>
			</div>
			<div class="nav-item u-pull-right">
				<v-touch class="text-icon" @tap="reload('/doc')" :class="{'is-active': '/doc' == currentPath}">
					<i class="icon icon-ic_kanban_black_24px"></i>
					<span class="icon-title">笔记</span>
				</v-touch>
			</div>
		</div>
		<v-touch class="float-action-button" @tap="createNew">
			<i class="icon icon-add"></i>
		</v-touch>
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
      currentPath (state) {
        return this.$store.state.sys.currentPath.split('?')[0];
      }
    },
		methods: {
			reload(page){
//        this.$store.dispatch('requestCount', 'aloha')
				this.$router.replace(page);
			},
      createNew(){}
		}
	};
</script>
<style lang="scss">
  @import "../assets/css/variables.scss";

  .c-bottom-nav {
    position: fixed;bottom:0;left:0;right:0;height:49px;
    background: #fff;
    box-shadow: $zDeepShadow2;
  }
  .c-bottom-nav .float-action-button {
    position: absolute;width: 58px;height:58px;line-height:58px;left:50%;
    margin-left: -29px;top: -29px;
  }
  .c-bottom-nav .nav-item {
    width: 21%;
  }
</style>
