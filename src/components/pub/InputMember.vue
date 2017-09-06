<template>
	<div class="itm-outer">
		<v-touch class="itm-inner" @tap="showMemberEdit">
			<div class="chengyuan">
        {{indexTitle}}
			</div>

			<div class="itm-icons itm-rear-icons u-abs-right u-max-half-width" v-if="selectedLocalList.length<=3&&selectedLocalList.length>0">
				<!--<div v-for="item in localList">{{item.avatar}}</div>-->
				<!--<img class="itm-icon-img" v-for="item in selectedLocalList" track-by="rsqUserId" :src="item.avatar" />-->
				<div class="itm-icon-img-wrap">
					<avatar v-for="item in selectedLocalList"
					        :key="item.rsqUserId"
					        :src="item.avatar"
					        :username="item.name"></avatar>
          <span>{{selectedLocalList.length}}人</span>

				</div>
			</div>
      <div class="itm-icons itm-rear-icons u-abs-right" v-else>
        <div class="itm-icon-img-wrap" v-if="selectedLocalList.length>3">
        <avatar v-for="item in selecteditems"
                :key="item.rsqUserId"
                :src="item.avatar"
                :username="item.name">

        </avatar>
        <span>{{selectedLocalList.length}}人</span>
        </div>
      </div>
		</v-touch>
	</div>
</template>
<style lang="">
  .chengyuan{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    line-height: 21px;
    line-height: 45px;
    margin-left: 9px;
  }

</style>
<script>
	import util from 'ut/jsUtil';
	import SelectMember from 'com/pub/SelectMember';
	import Avatar from 'com/pub/TextAvatar';

	export default{
		data(){
			return{
				localList: [],  //人员选择列表
				selectedLocalList: [],  //已选择的人员选择列表
				disabledLocalList: []  //本地禁用的人员列表
			};
		},
		props: {
			isNative: Boolean,  //是否使用钉钉应用本地的选择框
			indexTitle: String,
			selectTitle: String,
			userRsqIds: Array,    //可选人
			selectedRsqIds: Array,  //当前选中的人
			disabledRsqIds: Array   //不可选的人
		},
    computed: {
      loginUser (){
        return this.$store.getters.loginUser;
      },
      selecteditems(){
        return this.selectedLocalList.slice(this.selectedLocalList.length-3)
      }
    },
		components: {
			'avatar': Avatar
		},
		methods:{
			showMemberEdit(e){
				return this.isNative ? this.showNativeMemberEdit(e) : this.showWebMemberEdit(e);
			},
			showNativeMemberEdit(){
				var that = this;
        var corpId = that.loginUser.authUser.corpId;
				var selectedArray = util.extractProp(this.selectedLocalList, 'userId');
				var disabledArray = util.extractProp(this.disabledLocalList, 'userId');
				rsqadmg.exec('selectDeptMember', {
					btnText: '确定',  //选择器按钮文本，pc端需要的参数
					multiple: true, //默认false，选择单人
					maximum: -1,  //可选择人数的上限，默认-1不限制人数
					title: that.selectTitle, //选择器标题，pc端需要的参数
					corpId: corpId ,//加密的企业 ID，
					selectedIds: selectedArray,
					disabledIds: disabledArray || [], //不能选的人
					success: function(res) {
						//var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
//						console.log('---:list:' + JSON.stringify(res));
//							that.memberList = res;

						var idArray = util.extractProp(res, 'emplId');
						rsqadmg.exec('showLoader');
						that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId,idArray: idArray})
								.then(function(idMap){
									rsqadmg.exec('hideLoader');
									that.selectedLocalList = util.getMapValuePropArray(idMap);
									that.$emit('member-changed', that.selectedLocalList);
								});
					}
				});
			},
			showWebMemberEdit(){
				// 显示之前先将所有获得焦点的元素失去焦点
				if(document.activeElement){
					document.activeElement.blur();
				}
				var that = this;
				var corpId = that.loginUser.authUser.corpId;
				SelectMember.show({
					memberList: this.localList,
					selectedList: this.selectedLocalList,
					disabledIdList: this.disabledLocalList,
					success: function(selList){
						var idArray = util.extractProp(selList, 'emplId');
						that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId,idArray: idArray})
								.then(function(idMap){
									that.selectedLocalList = util.getMapValuePropArray(idMap);
									that.$emit('member-changed', that.selectedLocalList);
								});
					},
					cancel: function(){
					}
				});
			},
			prepareIds(){
				//  将rsqUserId转换为userId
				var that = this;
//				alert(this.selectedRsqIds);
				var ids = util.extractProp(this.userRsqIds, 'id');
				var disabledIds = util.extractProp(this.disabledRsqIds, 'id');
				var selectedRsqIds = util.extractProp(this.selectedRsqIds, 'id');
				var corpId = that.loginUser.authUser.corpId;
				var loadTimes = 0, maxQuery = 3;
				rsqadmg.exec('showLoader');
				this.$store.dispatch('fetchUseridFromRsqid',{corpId: corpId, idArray: ids})
						.then(function(idMap){
							loadTimes += 1;
							if(loadTimes >= maxQuery){
								rsqadmg.exec('hideLoader');
							}
							that.localList = util.getMapValuePropArray(idMap);
						});
				this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: disabledIds})
						.then(function(idMap){
							loadTimes += 1;
							if(loadTimes >= maxQuery){
								rsqadmg.exec('hideLoader');
							}
							that.disabledLocalList = util.getMapValuePropArray(idMap);
						});
				this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: selectedRsqIds})
						.then(function(idMap){
							loadTimes += 1;
							if(loadTimes >= maxQuery){
								rsqadmg.exec('hideLoader');
							}
							that.selectedLocalList = util.getMapValuePropArray(idMap);
						});
			}
		},
		mounted(){
//			var that = this;
//			this.$on('todo-data-ready', function(){
//				that.prepareIds();
//			});
			this.prepareIds();
		}
	};
</script>
