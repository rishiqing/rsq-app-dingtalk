<template>
  <div class="outer" :class="{'hasPadding':newTime}">
    <v-touch class="touch-memmber" @tap="showMemberEdit">
      <div class="execute">
        {{indexTitle}}
      </div>
      <div class="" v-if="selectedLocalList.length <= 3 && selectedLocalList.length > 0">
        <div v-if="newTime === true">
          <div class="itm-icon-img-wrap-new" :class="{'edit-padding-left':editTime,'new-padding-left-less-three':newMemberlessThree,'itm-icon-img-wrap-right':newTime,'itm-icon-img-wrap-left':editTime}">
            <avatar v-for="item in selectedLocalList"
                    :key="item.rsqUserId"
                    :src="item.avatar"
                    :username="item.name"></avatar>
          </div>
          <span :class="{'people':newTime,'people-left':editTime}">{{selectedLocalList.length}}人</span>
          <i class="icon2-arrow-right-small arrow"></i>
        </div>
        <div v-else="">
          <div class="itm-icon-img-wrap" :class="{'edit-padding-left':editTime,'new-padding-left':newTime,'itm-icon-img-wrap-right':newTime,'itm-icon-img-wrap-left':editTime}">
            <div class="wrap-member">
              {{nameConcat}}
            </div>
            <span :class="{'people':newTime,'people-left':editTime}">{{selectedLocalList.length}}人</span>
          </div>
          <i class="icon2-arrow-right-small arrow"></i>
        </div>
      </div>
      <div class="" v-else>
        <div v-if="newTime === true">
          <div class="itm-icon-img-wrap-new" :class="{'edit-padding-left':editTime,'new-padding-left-more-three':newMemberMoreThree,'itm-icon-img-wrap-right': newTime,'itm-icon-img-wrap-left':editTime}" v-if="selectedLocalList.length>3">
            <avatar v-for="item in selectedItems"
                    :key="item.rsqUserId"
                    :src="item.avatar"
                    :username="item.name">
            </avatar>
          </div>
          <span :class="{'people':newTime,'people-left':editTime}">等{{selectedLocalList.length}}人</span>
          <i class="icon2-arrow-right-small arrow"></i>
        </div>
        <div v-else="">
          <div class="itm-icon-img-wrap" :class="{'edit-padding-left':editTime,'new-padding-left':newTime,'itm-icon-img-wrap-right':newTime,'itm-icon-img-wrap-left':editTime}">
            <div class="wrap-member">
              {{nameConcat}}
            </div>
            <span :class="{'people':newTime,'people-left':editTime}">等{{selectedLocalList.length}}人</span>
          </div>
          <i class="icon2-arrow-right-small arrow"></i>
        </div>
      </div>
    </v-touch>
  </div>
</template>
<style scoped>
  .itm-icon-img-wrap-new>*{
    float: right;
    margin-right: 0.15rem;
  }
  .itm-icon-img-wrap-new{
    width: 2.5rem;
  }
  .touch-memmber{
    display: flex;
    align-items: center;
  }
  .wrap-member{
    max-width: 5.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    height:1.3rem;
    margin-left: 0.2rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
  }
  .select-member{
    /*font-family: PingFangSC-Regular;*/
    /*font-size: 17px;*/
    /*color: #999999;*/
    letter-spacing: 0;
    display: block;
    /*margin-left: 2px;*/
    /*float: left;*/
  }
  .execute{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    letter-spacing: 0;
  }
  .new-padding-left-more-three{
    /*left:5.3rem*/
    margin-left:3.7rem
  }
  .new-padding-left-less-three{
    /*left:5.3rem*/
    margin-left:4.2rem
  }
  .edit-padding-left{
    /*margin-left:1.8rem*/
  }
  .edit-padding-left-count{
    margin-left:4.4rem
  }
  /*.new-padding-left-count{*/
    /*right:0.94rem;*/
  /*}*/
  .people-left{
    float: left;
    /* position: absolute; */
    display: inline-block;
    margin-left: 0;
    color:#999999
    /* top: 0.05rem; */
    /*margin-top: -0.3rem;*/
  }
  .outer{
    border-bottom: 1px solid #E0E0E0;
    position: relative;
    /*height:1.3rem;*/
    line-height: 1.3rem;
    background-color: white;
  }
  .hasPadding{
    padding-left:3% ;
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
    right: 0.2rem;
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
      disabled: Boolean,
      isNative: Boolean,  //  是否使用钉钉应用本地的选择框
      indexTitle: String,
      selectTitle: String,
      userRsqIds: Array,    //  可选人
      selectedRsqIds: Array,  //  当前选中的人
      disabledRsqIds: Array,   //  不可选的人
      newTime: Boolean,
      editTime: Boolean
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser
      },
      selectedItems () {
        return this.selectedLocalList.slice(this.selectedLocalList.length - 3)
      },
      nameConcat () {
        return this.selectedLocalList.map(function (o) {
          return o.name
        }).join('、')
      },
      memberCount () {
        return this.selectedLocalList.length <= 3
      },
      newMemberlessThree () {
        return this.newTime && this.memberCount
      },
      newMemberMoreThree () {
        return this.newTime && !this.memberCount
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
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        return this.isNative ? this.showNativeMemberEdit(e) : this.showWebMemberEdit(e)
      },
      showNativeMemberEdit () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
//        console.log('提取之前内容是' + JSON.stringify(this.selectedLocalList))
        var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
//        console.log('提取之后内容是' + (selectedArray))
        var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
//        console.log('提取之后禁止内容是' + (selectedArray))
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
//            console.log('返回来的res是' + JSON.stringify(res))
            var idArray = util.extractProp(res, 'emplId')
//            console.log('返回来的idarray是' + idArray)
            window.rsqadmg.exec('showLoader')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
                .then(function (idMap) {
                  window.rsqadmg.exec('hideLoader')
                  var userArray = util.getMapValuePropArray(idMap)
//                  console.log('userId是' + JSON.stringify(userArray))
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
        //  暂时去掉loader
//        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: ids})
          .then(idMap => {
            this[targetListName] = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      }
    },
    mounted () {
//      console.log('传进来的selectedRsqIds' + this.selectedRsqIds)
    }
  }
</script>
