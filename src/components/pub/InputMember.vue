<template>
  <v-touch @tap="showMemberEdit">
    <div
      class="outer-wrap bottom-border" >
      <span
        v-show="selectedLocalList.length === 0"
        class="inner-key">
        {{ indexTitle }}</span>
      <div class="inner-value">
        <div
          v-for="(avatar,index) in avatarConcat"
          v-if="index < 5"
          :key="index"
          :style="{ backgroundImage: 'url(' + avatar.avatar + ')' }"
          class="avatar"
        >
          <span v-if="!avatar.avatar">{{ avatar.name }}</span>
        </div>
      <span class="count">{{ selectedLocalList.length }}人</span></div>
      <i class="icon2-arrow-right-small arrow"/>
    </div>
  </v-touch>
</template>
<script>
  import { Promise } from 'es6-promise'
  import util from 'ut/jsUtil'
  import SelectMember from 'com/pub/SelectMember'

  export default {
    name: 'InputMember',
    props: {
      //  是否有左侧的空间，默认是没有的，编辑模式下是有左边的padding
      hasLeftSpace: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      },
      isNative: {
        type: Boolean,
        default: true
      },  //  是否使用钉钉应用本地的选择框
      indexTitle: {
        type: String,
        default: ''
      },
      selectTitle: {
        type: String,
        default: ''
      },
      userRsqIds: {
        type: Array,
        required: true
      },    //  可选人
      selectedRsqIds: {
        type: Array,
        required: true
      },  //  当前选中的人
      disabledRsqIds: {
        type: Array,
        required: true
      },   //  不可选的人
      editTime: {
        type: Boolean,
        default: false
      },
      createrRsqIds: {
        type: Array,
        required: true
      },
      maximum: {
        type: Number,
        default: 299
      },
      singleSelect: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        localList: [],  //  人员选择列表
        selectedLocalList: [],  //  已选择的人员选择列表
        disabledLocalList: [],  //  本地禁用的人员列表
        creatorList: []// 创建者
      }
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser
      },
      avatarConcat () {
        return this.selectedLocalList.map(function (o) {
          return o
        })
      },
      realUserRsqIds () {
        return this.$store.state.realStaff.list
      },
      memberCount () {
        return this.selectedLocalList.length <= 3
      },
      // userRsqIdArray () {
      //   return this.userRsqIds.map(function (staff) {
      //     return staff
      //   })
      // },
      creatorListArray () {
        return this.creatorList.map(function (staff) {
          return staff.rsqUserId
        })
      },
      selectRsqidArray () {
        return this.selectedLocalList.map(function (staff) {
          return staff.rsqUserId
        })
      },
      disableRsqidArray () {
        return this.disabledRsqIds.map(function (staff) {
          return staff.id
        })
      }
    },
    watch: {
      selectedRsqIds () {
        this.fetchUserIds(this.selectedRsqIds, 'selectedLocalList')
      },
      disabledRsqIds () {
        this.fetchUserIds(this.disableRsqidArray, 'disabledLocalList')
      },
      createrRsqIds () {
        this.fetchUserIds(this.createrRsqIds, 'creatorList')
      },
      userRsqIds (newIds) {
        this.fetchUserIds(this.userRsqIds, 'localList')
      }
    },
    created () {
      this.fetchUserIds(this.userRsqIds, 'localList')
    },
    methods: {
      fetchUsers () {
        this.$store.dispatch('fetchUsers')
      },

      showMemberEdit (e) {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
//        this.fetchUsers()
//        this.$router.push('/pub/MemberEdit')
        return this.isNative ? this.showNativeMemberEdit(e) : this.showWebMemberEdit(e)
      },
//       showNativeMemberEdit () {
//         var that = this
//         var corpId = that.loginUser.authUser.corpId
//         var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
//         var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
//         window.rsqadmg.exec('selectDeptMember', {
//           btnText: '确定',  //  选择器按钮文本，pc端需要的参数
//           multiple: true, //  默认false，选择单人
//           maximum: -1,  //  可选择人数的上限，默认-1不限制人数
//           title: that.selectTitle, //  选择器标题，pc端需要的参数
//           corpId: corpId,  //  加密的企业 ID，
//           selectedIds: selectedArray,
//           disabledIds: disabledArray || [], //  不能选的人
//           success (res) {
// //            var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
// //              that.memberList = res
//             if (res.length === 0) {
//               return this.$emit('member-changed', [])
//             }
//             var idArray = util.extractProp(res.result.userList, 'id')
// //            window.rsqadmg.exec('showLoader')
//             that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
//                 .then(function (idMap) {
// //                  window.rsqadmg.exec('hideLoader')
//                   var userArray = util.getMapValuePropArray(idMap)
//                   var rsqIdArray = util.extractProp(userArray, 'rsqUserId')
//                   that.$emit('member-changed', rsqIdArray)
//                 })
//           }
//         })
//       },
      showWebMemberEdit () {
        const that = this
        var disSelect = []
        var creSelect = []
        if (this.createrRsqIds[0]) {
          creSelect = [this.createrRsqIds[0].toString()]
        }
        if (this.disabledRsqIds[0]) {
          disSelect = this.disabledRsqIds.map(function (o) {
            return o.toString()
          })
        }
        var old = [...this.selectRsqidArray]
        // console.log(this.realUserRsqIds)
        SelectMember.show({
          nameAttribute: 'name',
          maximum: this.maximum,
          idAttribute: 'rsqUserId',
          memberList: this.localList,
          selectedIdList: this.selectRsqidArray,
          disabledIdList: disSelect,
          realStaff: this.realUserRsqIds,
          // 转换为字符串
          creatorIdList: creSelect,
          singleSelect: this.singleSelect,
          success (selList) {
            const arr = selList.map(m => {
              return m.rsqUserId
            })
            that.selectedLocalList = [...selList]
            // that.selectedLocalList = selList
            // var idArray = util.extractProp(selList, 'emplId')
            // that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
            //   .then(function (idMap) {
            //     that.selectedLocalList = util.getMapValuePropArray(idMap)
            that.$emit('member-changed', arr, old)
            //   })
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
    }
  }
</script>
<style lang="scss" scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    background-color: transparent;
    min-height: 56px;
  }
  .inner-key{
    display: block;
    position: absolute;
    line-height: 1.3rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    width: 2rem;
    color: #333333;

  }
  .inner-value {
    min-width: 100%;
    overflow: hidden;
    line-height: 100%;
    height: 100%;
    width: 100%;
    min-height: 36px
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    height: 100%;
    line-height: 56px;
    right: 0.2rem;
  }
  .isInbox{
    border-bottom: 0.5px solid #D4D4D4;
  }
  .has-padding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left:1.3rem;
  }
  .bottom-border{
    border-bottom: 0.5px solid #D4D4D4;
  }
  .avatar{
    margin-right: 0.3rem;
    float: left;
  }
  .count{
    position: absolute;
    right: 0.82666rem;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: rgba(25,31,37,0.56);
    letter-spacing: 0;
    line-height: 1rem;
  }
  .avatar{
    width: 36px;
    height: 36px;
    text-align: center;
    vertical-align: middle;
    background-color: rgb(74, 144, 226);
    font-style: normal;
    font-variant: normal;
    font-weight: bold;
    font-stretch: normal;
    font-size: 14px;
    line-height: 37px;
    font-family: Helvetica, Arial, sans-serif;
    color: rgb(255, 255, 255);
    border-radius: 50%;
    background-position: center center;
    background-size: 100% 100%;
  }
</style>
