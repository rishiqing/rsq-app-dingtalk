<template>
  <div class="child-plan-main">
    <div class="top-child">
      <div class="top-sub">
        <v-touch
          class="top-sub-plan"
          @tap="changeState" >
          <span class="top-sub-plan-name">{{ currentSubPlan.name }}</span>
          <i class="icon2-arrow-down arrow-down"/>
        </v-touch>
      </div>
    </div>
    <ul
      v-if="cardListNum !== 0"
      class="ul-list">
      <v-touch
        v-for="item in cardList"
        :key="item.id"
        :data-id="item.id"
        tag="li"
        class="li-item"
        @tap="select(item.id)">
        <span>
          {{ item.name }}
        </span>
        <i
          :class="{ 'icon2-selected': item.id === clickId ? true : false}"
          class="selected-icon"/>
      </v-touch>
    </ul>
    <div
      v-if="cardListNum !== 0"
      class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="delayCall('move')">
          确定
        </v-touch>
      </div>
    </div>
    <div
      v-else
      class="item-list">
      <img src="../../assets/img/cardlist.svg">
      <p class="shouye">当前子计划下，没有任务列表</p>
    </div>
    <ul
      :class="{'show-child': initialState}"
      class="child-plan">
      <li
        v-for="item in childPlanList"
        :key="item.id">
        <v-touch
          class="child-plan-item"
          @tap="getCardList($event,item)">
          <div class="sub-plan-forward">
            <img
              src="../../assets/img/subplan.png"
              class="sub-plan-img">
            <div class="sub-plan-name">{{ item.name }}</div>
          </div>
        </v-touch>
      </li>
    </ul>
    <v-touch
      v-show="initialState"
      class="mask"
      @tap="changeState"/>
  </div>
</template>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'MoveToPlanItem',
    components: {
    },
    data () {
      return {
        initialState: false,
        currentSubPlan: {
          name: ''
        },
        clickId: 0,
        plan: false
      }
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      childPlanList () {
        return this.$store.state.childPlanList
      },
      cardList () {
        return this.$store.state.cardList
      },
      cardListNum () {
        return this.$store.state.cardList.length
      },
      currentSubPlanOfTask () {
        return this.$store.state.currentSubPlan
      },
      pos () {
        return this.$store.state.pos
      },
      num () {
        return this.$store.state.num
      },
      labels () {
        return this.$store.state.labels
      },
      userRoles () {
        return this.currentPlan.userRoles
      },
      removePlanControl () {
        return this.currentPlan.editControl.removeKB
      },
      kanbanItem () {
        if (this.plan) {
          return this.$store.state.plan.currentKanbanItem.childKanbanId
        } else {
          return this.$store.state.todo.currentTodo.kanbanItem.kanbanItemId || null
        }
      },
      kanbanId () {
        if (this.plan) {
          return this.$store.state.plan.currentKanbanItem.kanbanCardId
        } else if (this.$store.state.todo.currentTodo.kanbanItem) {
          return this.$store.state.todo.currentTodo.kanbanItem.kanbanId
        } else {
          return null
        }
      },
      kanbanName () {
        return this.$store.state.todo.currentTodo.kanbanItem.kanbanName || null
      },
      levelTwoId () {
        if (this.plan) {
          return this.$store.state.plan.currentKanbanItem.kanbanCardId
        } else if (!this.plan && this.$store.state.todo.currentTodo.from) {
          return this.$store.state.todo.currentTodo.from.levelTwoId || null
        }
      },
      id () {
        if (this.plan) {
          return this.$store.state.plan.currentKanbanItem.id
        } else {
          return this.$store.state.todo.currentTodo.id
        }
      },
      pId () {
        return this.$store.state.currentPlan.id
      },
      pName () {
        return this.$store.state.currentPlan.name
      }
    },
    mounted () {
      var that = this
      this.plan = this.$route.query.target === 'plan'
      this.clickId = this.levelTwoId || null
      window.rsqadmg.exec('setTitle', {title: '选择任务列表'})
      // 拿到看板列表以及看板的任务列表。。。好多数据
      var creatorId = this.$store.state.loginUser.rsqUser.id
      for (var i = 0; i < this.userRoles.length; i++) {
        if (this.userRoles[i].userId === creatorId) {
          this.ifShowCreate = true
        }
      }
      var id = null
      if (this.plan) {
        id = this.$store.state.plan.currentKanbanItem.childKanbanId
      } else {
        id = this.$store.state.todo.currentTodo.from ? this.$store.state.todo.currentTodo.from.levelFourId : null
      }
      if ((this.plan || this.$store.state.todo.currentTodo.kanbanItem) && this.childPlanList.some(function (o) {
        return o.id === id
      })) {
        that.$store.dispatch('getCardList', {id: id}).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
            that.currentSubPlan.name = that.plan ? that.$store.state.plan.currentKanbanItem.childKanbanName : that.$store.state.todo.currentTodo.from.levelFourName
          })
      } else {
        if (this.childPlanList) {
          this.currentSubPlan = this.childPlanList[0]
        }
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        this.$store.dispatch('getCardList', this.childPlanList[0]).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          })
      }
    },
    methods: {
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      move () {
        var that = this
        if (this.plan && this.clickId && this.clickId !== this.levelTwoId) {
          this.$store.dispatch('planToPlan', {itemId: this.id, cardId: this.clickId})
          // .then(function (res) {
            // var url = window.location.href.split('#')
            // var name = that.$store.getters.loginUser.authUser.name
            // var datas = {
            //   corpId: that.$store.getters.loginUser.authUser.corpId,
            //   agentid: that.$store.getters.loginUser.authUser.corpId,
            //   title: name + ' 将任务移至计划 ' + that.pName,
            //   url: url[0] + '#' + '/plan/' + res.kanbanId + '/child-plan',
            //   description: res.name,
            //   receiverIds: that.$store.state.plan.currentKanbanItem.joinUserIds
            // }
            // if (that.pId !== that.kanbanId) {
              // return that.$store.dispatch('qywxSendMessage', datas)
            // }
          // })
          .then(function () {
            that.$router.go(-2)
          })
        } else if (this.clickId && this.clickId !== this.levelTwoId) {
          this.$store.dispatch('moveToPlan', {todoId: this.id, cardId: this.clickId, createTaskDate: Number(dateUtil.dateNum2Text(new Date().getTime()))})
          // .then(function () {
            // var url = window.location.href.split('#')
            // var name = that.$store.getters.loginUser.authUser.name
            // var datas = {
            //   corpId: that.$store.getters.loginUser.authUser.corpId,
            //   agentid: that.$store.getters.loginUser.authUser.corpId,
            //   title: name + ' 将任务添置计划 ' + that.pName,
            //   url: url[0] + '#' + '/sche/todo/' + that.$store.state.todo.currentTodo.id,
            //   description: that.$store.state.todo.currentTodo.pTitle,
            //   receiverIds: that.$store.state.todo.currentTodo.receiverIds
            // }
            // if (that.pId !== that.kanbanId) {
              // return that.$store.dispatch('qywxSendMessage', datas)
            // }
          // })
        .then(function () {
          that.$router.go(-2)
        })
        } else {
          that.$router.go(-2)
        }
      },
      changeState (e) {
        e.preventDefault()
        this.initialState = !this.initialState
      },
      getCardList (e, item) {
        e.preventDefault()
        var that = this
        this.initialState = false
        this.currentSubPlan = item
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        this.$store.dispatch('getCardList', item).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          })
      },
      select (id) {
        this.clickId = id
      }
    }
  }
</script>
<style lang="scss" scoped>
  .selected-icon{
    display: none;
    align-items: flex-start;
    padding-top: 0.05rem;
    line-height: 56px
  }
  .child-plan-main{
    background-color: #f5f5f5;
    height: 100vh;
  }
  .sub-plan-forward{
    display: flex;
    align-items: center;
  }
  .child-plan-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.1rem;
    position: relative;
    // border-bottom: 0.5px solid #d4d4d4;
  }
  .child-plan-item:after{
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
  .selected-icon{
    color: #55A8FD;
    font-size: 14px;
    margin-right: 0.3rem
  }
  .sub-plan-img{
    width: 20px;
    height: 20px;
  }
  .sub-plan-name{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
    width: 94%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .arrow-down{
    font-size: 12px;
    margin-left: 0.1rem;
    color: #c7c7c7;
  }
  .top-sub-plan-name{
    max-width: 4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3D3D3D;
  }
  .top-sub{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .top-sub-plan{
    display: flex;
    align-items: center;
    margin:0 auto
  }
  .mask{
    width: 100%;
    height: 100%;
    background: #000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    opacity: 0.6;
  }

  .top-child{
    z-index: 100;
    position: relative;
    background-color: #fafafa;
    // border-bottom: 0.5px solid #D4D4D4;
  }
  .top-child:after{
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
  ul.show-child{
    top: 46px
  }
  .child-plan {
    position: fixed;
    top:-20rem;
    transition: 0.5s;
    z-index: 50;
    background-color: white;
    width: 96%;
    padding-left: 15px;
    padding-right: 15px;
    // box-shadow: 0 2px 2px 0 rgba(233,233,233,0.50);
  }
  .ul-list{
    margin-top: 20px;
    background-color: #fff;
    position: relative;
  }
  .ul-list:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .ul-list:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .li-item{
    height: 56px;
    line-height: 56px;
    margin-left: 15px;
    // border-bottom: 0.5px solid #d4d4d4;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    position: relative;
  }
  .li-item:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .li-item:last-child:after{
    border-bottom: 0;

  }
  .icon2-selected{
    display: flex
  }
  .item-list{
    text-align: center;
    background-color: #F5F5F5;
    height: 78%;

    img{
      width: 1.866rem;
      height: 1.866rem;
      margin-top:3.653rem ;
      vertical-align: bottom;
    }
    .shouye{
      padding: 0;
      margin:0;
      margin-top:30px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #55A8FD;
      letter-spacing: 0;
    }
  }
</style>
