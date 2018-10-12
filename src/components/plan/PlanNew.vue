<template>
  <div>
    <div class="pb">
      <input
        v-model="content"
        type="text"
        class="create-plan"
        placeholder="计划名称">
    </div>
    <div class="wrap-plan-member">
      <div class="plan-member-word">
        <span>计划成员</span><span class="count">{{ selectedLocalList.length }}人</span>
      </div>
      <v-touch
        class="plan-member"
        @tap="showWebMemberEdit">
        <div
          v-for="(avatar,index) in avatarConcat"
          v-if="index <= 5"
          :key="index"
          :style="{ backgroundImage: 'url(' + avatar.avatar + ')' }"
          class="avatar">
          <span v-if="!avatar.avatar">{{ avatar.name }}</span>
        </div>
        <i
          v-if="selectedLocalList.length < 7"
          class="icon2-add add-member"/>
        <img
          v-if="selectedLocalList.length >=7"
          src="../../assets/img/mp.png"
          class="mp">
      </v-touch>
    </div>
    <div class="wrap-most">
      <div class="plan-templ">计划模板</div>
      <div class="wrap-all">
        <div
          v-for="item in imgs"
          :key="item.id">
          <v-touch
            class="wrap-muban"
            @tap=" currentTemplate = item">
            <img
              v-show="currentTemplate === item"
              src="../../assets/img/selected.png"
              class="templ cover-img">
            <img
              :src="item.cover"
              class="templ">
            <div class="templ-name">{{ item.name }}</div>
          </v-touch>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="delayCall('create')">
          创建
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import PlanList from 'com/plan/PlanList'
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  import { Promise } from 'es6-promise'
  import SelectMember from 'com/pub/SelectMember'

  export default {
    name: 'PlanNew',
    components: {
      'PlanList': PlanList,
      'avatar': Avatar
    },
    data () {
      return {
        content: '',
        currentTemplate: {},
        rsqIdArray: [],
        localList: [],  //  人员选择列表
        selectedLocalList: [],  //  已选择的人员选择列表
        disabledLocalList: [],  //  本地禁用的人员列表
        creatorList: [], // 创建者
        memArray: [],
        idArray: []
      }
    },
    computed: {
      userRsqIds () {
        return this.$store.state.staff.list
      },
      realUserRsqIds () {
        return this.$store.state.realStaff.list
      },
      selectedRsqIds () {
        return [this.$store.state.loginUser.rsqUser.id]
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      planItems () {
        return this.$store.state.planList
      },
      imgs () {
        return this.$store.state.plan.coverList
      },
      avatarConcat () {
        return this.selectedLocalList.map(function (o) {
          return o
        })
      },
      memberCount () {
        return this.selectedLocalList.length <= 3
      },
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
      createrRsqIds () {
        return [this.$store.getters.loginUser.rsqUser.id]
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
      }
    },
    created () {
      this.findId(this.realUserRsqIds)
      if (this.imgs === null) {
        this.$store.dispatch('getTemplate').then(() => {
          if (this.imgs.length > 0) {
            this.currentTemplate = this.imgs[0]
          }
        })
      } else {
        this.currentTemplate = this.imgs[0]
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '新建计划'})
      var createrId = [this.$store.state.loginUser.rsqUser.id]
      this.getMember(createrId)
      this.fetchUserIds(this.idArray, 'localList')
    },
    methods: {
      findId (id) {
        var that = this
        for (let i = 0; i < id.length; i++) {
          for (let j = 0; j < id[i].userList.length; j++) {
            that.idArray.push(id[i].userList[j].id)
          }
          if (Array.isArray(id[i].childList)) {
            if (id[i].childList.length !== 0) {
              that.findId(id[i].childList)
            }
          }
        }
      },
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      create () {
        var that = this
        if (!this.content || /^\s+$/.test(that.content)) {
          return window.rsqadmg.execute('alert', {message: '请填写计划名称'})
        }
        // var url = window.location.href.split('#')
        // var name = that.$store.getters.loginUser.authUser.name
        window.rsqadmg.exec('showLoader', {text: '创建中...'})
        var rsqId = this.memArray.join(',')
        var params = {
          name: this.content,
          cover: this.currentTemplate.cover,
          selectGroupId: 'all',
          tKanbanId: this.currentTemplate.tKanbanId,
          accessIds: rsqId,
          attribute: 'company',
          childKanbanList: [],
          deptIds: '',
          editAuthority: 'all',
          isDefault: false,
          isKanban: true,
          isLoaded: false,
          kanbanAllKList: [],
          kanbanAllTList: [],
          processLoad: false,
          userIds: '',
          userRoles: [],
          starMark: false,
          position: 'bottom'
        }
        that.$store.dispatch('postPlan', params).then((res) => {
          window.rsqadmg.exec('hideLoader')
          window.rsqadmg.exec('toast', {message: '创建成功'})
          // let datas = {
          //   corpId: that.$store.getters.loginUser.authUser.corpId,
          //   agentid: that.$store.getters.loginUser.authUser.corpId,
          //   title: name + ' 将你添加到计划 ' + that.content,
          //   url: url[0] + '#' + '/plan/list',
          //   description: that.content,
          //   receiverIds: rsqId
          // }
          // console.log(datas)
          // that.$store.dispatch('qywxSendMessage', datas)
          that.$router.go(-1)
        })
      },
      getMember (id) {
        var corpId = this.loginUser.authUser.corpId
        //  暂时去掉loader
//        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: id})
          .then(idMap => {
            this.selectedLocalList = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      },
      showWebMemberEdit () {
        const that = this
        SelectMember.show({
          nameAttribute: 'name',
          idAttribute: 'rsqUserId',
          memberList: this.localList,
          realStaff: this.realUserRsqIds,
          selectedIdList: this.selectRsqidArray,
          disabledIdList: [this.createrRsqIds[0].toString(), this.$store.state.loginUser.rsqUser.id.toString()],
          // 转换为字符串
          creatorIdList: [this.createrRsqIds[0].toString()],
          success (selList) {
            const arr = selList.map(m => {
              return m.rsqUserId
            })
            window.rsqadmg.exec('setTitle', {title: '新建计划'})
            that.selectedLocalList = [...selList]
            that.memArray = [...arr]
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
  .plan-member .avatar{
    margin-right: 0.3rem;
    float: left;
  }
  input::placeholder{
    color: #B1B1B1;
  }
  .cover-img{
    position: absolute;
    top: 0;
    width: 2.08rem;
    height: 1.173rem;
    left: 0px;
    right: 0;
  }
  .people-number{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: rgba(25,31,37,0.56);
  }
  .plan-member-word{
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 1rem;
    color: #9B9B9B;
    height: 1rem;
    width: 100%;
    position: relative;
    // border-bottom: 1px solid #d4d4d4;
  }
  .plan-member-word:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .wrap-plan-member{
    display: flex;
    justify-content: space-between;
    align-items: left;
    background-color: white;
    margin-top: 20px;
    padding-left: 15px;
    padding-right: 0.2rem;
    flex-direction:column;
    position: relative;
  }
  .wrap-plan-member:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .wrap-plan-member:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .plan-member{
    display: flex;
    max-width: 100%;
    width: 100%;
    align-items:  center;
    height: 1.33rem
  }
  .arrow-right{
    font-size: 20px;
    color:rgba(25,31,37,0.28);
  }
  .post-plan{
    width: 94%;
    height: 1.263rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2F7DCD;
    border-radius: 5px;
    color: white;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    margin: 0 auto;
    margin-top: 0.3rem;
  }
  .wrap-most{
    background-color: white;
    margin-top: 20px;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
    position: relative;
    // border-top: 0.5px solid #d4d4d4;
    // border-bottom: 0.5px solid #d4d4d4;
  }
  .wrap-most:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 9999
  }
  .wrap-most:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 9999;
  }
  .plan-templ{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000000;
    line-height: 24px;
    margin-left: 15px;
  }
  .templ-name{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #8C8C8C;
  }
  .wrap-all{
    display: flex;
    align-items: center;
    margin-top: 0.6rem;
    overflow-x: hidden;
  }
  .wrap-muban{
    position: relative;
    text-align: center;
    margin-left: 15px;
  }
  .templ{
    width: 2.08rem;
    height: 1.173rem;
    border-radius: 3px;
  }
  .create-plan{
    height: 1.466rem;
    background-color: white;
    padding: 0.3rem;
    padding-left: 15px;
    margin-top: 20px;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    // border-top: 0.5px solid #d4d4d4;
    // border-bottom: 0.5px solid #d4d4d4;
    // line-height: 17px;
  }
  .pb{
    position: relative;
  }
  .pb:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .pb:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .count{
    align-items: right;
  }
  .add{
    display: inline-block;
  }
  .display-none{
    display: none;
  }
  .weui-btn{
    border: 0;
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
    margin: 0 4px 0 4px;
  }
  .avataradd{
    background-color: transparent
  }
  .mp{
    width: 21px;
    height: 5px;
  margin-left: 20px;
  }
    .add-member{
    color: #D6D6D6;
    font-size: 23px;
    margin-left: 0.3rem;
  }
  input::placeholder{
    line-height: normal;
    font-size: 17px
}
</style>
