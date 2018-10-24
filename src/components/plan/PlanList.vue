<template>
  <div class="pl">
    <v-touch
      @tap="watchVersion"
      class="version">
      <div class="left">
        <img src="../../assets/img/version.svg">
        <div class="text">
          <span class="bb">试用版</span> 
          <span class="day">2019-10-31</span>
        </div>
      </div>
      <div class="right">
        收费说明
        <i class="icon2-arrow-right-small arrow"></i>
      </div>
    </v-touch>
    <ul
      v-if="planItems.length > 0"
      :class="{'plan-count': planCount}"
      class="plan-list">
      <r-plan
        v-for="item in arr"
        :key="item.id"
        :item="item"
        @list-sort="listSort"/>
    </ul>
    <div
      v-else
      class="item-list">
      <img src="../../assets/img/newplan.svg">
      <p class="shouye">还没有计划，赶快去创建吧</p>
      <v-touch
        class="new"
        @tap="toCreate"
      >新建计划</v-touch>
    </div>
    <v-touch @tap="toCreate" v-if="planItems.length > 0">
      <img
        class="main_inbox"
        src="../../assets/img/add.svg">
    </v-touch>
  </div>
</template>
<script>
  import Plan from 'com/plan/Plan'
  import Nav from 'com/Nav'

  export default {
    name: 'PlanList',
    components: {
      'r-plan': Plan,
      'r-nav': Nav
    },
    data () {
      return {
        arr: []
      }
    },
    computed: {
      planItems () {
        if (this.$store.state.planList.length <= 0) {
          return this.$store.state.planList
        } else {
          let arr1 = []
          let arr2 = []
          for (let i = 0;i < this.$store.state.planList.length; i++) {
            if (this.$store.state.planList[i].starMark) {
              arr1.push(this.$store.state.planList[i])
            } else {
              arr2.push(this.$store.state.planList[i])
            }
          }
          return arr1.concat(arr2)
        }
        // return this.$store.state.planList
      },
      planCount () {
        return this.planItems.length > 8
      }
      // planSort () {
        // this.arr = this.planItems
        // for (let i = 0; i < this.arr.length; i++) {
        //   if (this.arr[i].starMark === true) {
        //     var select = this.arr.splice(i, 1)
        //     // console.log(arr)
        //     this.arr.unshift(select[0])
        //   }
        // }
        // arr.map(function (o, i) {
        //   if (o.starMark === true) {
        //     var select = arr.splice(i, 1)
        //     arr.unshift(select[0])
        //   }
        // })
        // return arr
      // }
    },
    watch: {
      planItems (newId) {
        this.arr = [...newId]
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '计划'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('getPlan').then((res) => {
        this.$store.commit('SAVE_PLANS', res)
      })
    },
    methods: {
      toCreate () {
        this.$router.push('/plan/create')
      },
      listSort (item) {
        // console.log(this.arr)
        // var that = this
        // for (let i = 0; i < that.arr.length; i++) {
        //   if (item.id === that.arr[i].id) {
        //     if (!item.starMark) {
        //       var select = that.arr.splice(i, 1)[0]
        //       that.arr.unshift(select)
        //     } else {
        //       var select2 = that.arr.splice(i, 1)[0]
        //       that.arr.push(select2)
        //     }
        //   }
        // }
      },
      watchVersion () {
        this.$router.push('/version')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pl{
    height: calc(100vh - 50px);
    overflow: hidden;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }
  .plan-count{
    // margin-bottom: 1.5rem;
  }
  .post-new-plan{
    font-size: 18px;
    font-family: PingFangSC-Medium;
    margin-left: 0.2rem;
  }
  .wrap-empty-plan{
    display: flex;
    align-items: center;
    padding: 0.3rem;
    border: 1px solid lightgray;
  }
  .plan-empty{
    width: 1rem;
    height: 1rem;
  }
  .plan-list{
    background-color: white;
    padding-left: 15px;
    margin-top: 20px;
    overflow-x: hidden;
    position: relative;
    // border-top: 0.5px solid #d4d4d4;
    // border-bottom: 0.5px solid #d4d4d4;
  }
  .plan-list:before{
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
  .plan-list:after{
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
  .forward-plan{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .plan-image{
    width: 0.906rem;
    height: 0.906rem;
  }
  .plan-name{
    width: 7.4rem;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
    color: #2F7DCD;
  }
  .plan{
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    // border-bottom: 1px solid #EAEAEA;
  }
  .main_inbox{
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 48px;
    height: 48px;
    z-index: 9999999;
  }
  .new{
  width:141px;
  height:36px;
  background:rgba(90,160,232,1);
  border-radius:23px;
  border-radius: 23px;
  color: #fff;
  line-height: 36px;
  margin: 0 auto;
  margin-top: 30px;
  }
  .version{
    margin-top: 20px;
    width:100%;
    height:56px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 4px 0px rgba(43,136,254,0.16);
    display: flex;
    justify-content: space-between;
    .left{
      margin-left: 15px;
      display: flex;
      align-items: center;
      img{
        display: block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .text{
        span{
          display: block
        }
        .bb{
          height:21px;
          font-size:15px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:#458CDA;
          line-height:21px;
        }
        .day{
        height:17px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(140,140,140,1);
        line-height:17px;
        }
      }
    }
    .right{
      margin-right: 15px;
      height:56px;
      font-size:13px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(157,177,201,1);
      line-height:56px;
    }
  }
</style>
