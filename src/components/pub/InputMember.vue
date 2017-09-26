<template>
  <div class="outer">
    <v-touch class="" @tap="showMemberEdit">
      <div class="execute">
        {{indexTitle}}
      </div>
      <div class="" v-if="selectedLocalList.length <= 3 && selectedLocalList.length > 0">
        <!--<div v-for="item in localList">{{item.avatar}}</div>-->
        <!--<img class="itm-icon-img" v-for="item in selectedLocalList" track-by="rsqUserId" :src="item.avatar" />-->
        <div class="itm-icon-img-wrap">
          <avatar v-for="item in selectedLocalList"
                  :key="item.rsqUserId"
                  :src="item.avatar"
                  :username="item.name"></avatar>
        </div>
        <span class="people">{{selectedLocalList.length}}人</span>
        <i class="icon2-arrow-right-small arrow"></i>
      </div>
      <div class="" v-else>
        <div class="itm-icon-img-wrap" v-if="selectedLocalList.length>3">
          <avatar v-for="item in selectedItems"
                  :key="item.rsqUserId"
                  :src="item.avatar"
                  :username="item.name">
          </avatar>
        </div>
        <span class="people">{{selectedLocalList.length}}人</span>
        <i class="icon2-arrow-right-small arrow"></i>
      </div>
    </v-touch>
  </div>
</template>
<style scoped>
  .execute{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    letter-spacing: 0;
  }
  .outer{
    border-bottom: 1px solid #E0E0E0;
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    padding-left:3% ;
    background-color: white;
  }
  .people{
    position:absolute;
    top:0;
    color: #999999;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
    right:0.94rem;
  }
  span{
    display: block;
    /*margin-bottom: 5px;*/
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    /*line-height: 1.458rem;*/
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:0.38rem;
    right: 0.3rem;
  }
</style>
<script>
  import { Promise } from 'es6-promise'
  import util from 'ut/jsUtil'
  import SelectMember from 'com/pub/SelectMember'
  import Avatar from 'com/pub/TextAvatar'

  export default {
    data () {
      return {
        localList: [],  //  人员选择列表
        selectedLocalList: [],  //  已选择的人员选择列表
        disabledLocalList: []  //  本地禁用的人员列表
      }
    },
    props: {
      isNative: Boolean,  //  是否使用钉钉应用本地的选择框
      indexTitle: String,
      selectTitle: String,
      userRsqIds: Array,    //  可选人
      selectedRsqIds: Array,  //  当前选中的人
      disabledRsqIds: Array   //  不可选的人
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser
      },
      selectedItems () {
        return this.selectedLocalList.slice(this.selectedLocalList.length - 3)
      }
    },
    watch: {
      userRsqIds (ids) {
        this.fetchUserIds(ids, 'localList')
      },
      selectedRsqIds (ids) {
        this.fetchUserIds(ids, 'selectedLocalList')
      },
      disabledRsqIds (ids) {
        this.fetchUserIds(ids, 'disabledLocalList')
      }
    },
    components: {
      'avatar': Avatar
    },
    methods: {
      showMemberEdit (e) {
        return this.isNative ? this.showNativeMemberEdit(e) : this.showWebMemberEdit(e)
      },
      showNativeMemberEdit () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
        var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
        var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
        window.rsqadmg.exec('selectDeptMember', {
          btnText: '确定',  //  选择器按钮文本，pc端需要的参数
          multiple: true, //  默认false，选择单人
          maximum: -1,  //  可选择人数的上限，默认-1不限制人数
          title: that.selectTitle, //  选择器标题，pc端需要的参数
          corpId: corpId,  //  加密的企业 ID，
          selectedIds: selectedArray,
          disabledIds: disabledArray || [], //  不能选的人
          success (res) {
//            var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
//              that.memberList = res
            if (res.length === 0) {
              return this.$emit('member-changed', [])
            }

            var idArray = util.extractProp(res, 'emplId')
            window.rsqadmg.exec('showLoader')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
                .then(function (idMap) {
                  window.rsqadmg.exec('hideLoader')
                  var userArray = util.getMapValuePropArray(idMap)
                  var rsqIdArray = util.extractProp(userArray, 'rsqUserId')
                  that.$emit('member-changed', rsqIdArray)
                })
          }
        })
      },
      showWebMemberEdit () {
        // 显示之前先将所有获得焦点的元素失去焦点
        if (document.activeElement) {
          document.activeElement.blur()
        }
        var that = this
        var corpId = that.loginUser.authUser.corpId
        SelectMember.show({
          memberList: this.localList,
          selectedList: this.selectedLocalList,
          disabledIdList: this.disabledLocalList,
          success (selList) {
            var idArray = util.extractProp(selList, 'emplId')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
                .then(function (idMap) {
                  that.selectedLocalList = util.getMapValuePropArray(idMap)
                  that.$emit('member-changed', that.selectedLocalList)
                })
          },
          cancel () {
          }
        })
      },
      fetchUserIds (ids, targetListName) {
        if (!ids || ids.length === 0) {
          this[targetListName] = []
          return Promise.resolve()
        }
        var corpId = this.loginUser.authUser.corpId
        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: ids})
          .then(idMap => {
            this[targetListName] = util.getMapValuePropArray(idMap)
            window.rsqadmg.exec('hideLoader')
          })
      }
    },
    mounted () {}
  }
</script>
