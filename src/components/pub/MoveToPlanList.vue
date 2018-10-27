<template>
  <div>
    <ul
      v-if="planItems.length > 0"
      :class="{'plan-count': planCount}"
      class="plan-list">
      <r-plan
        v-for="item in arr"
        :key="item.id"
        :item="item"/>
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
  </div>
</template>
<script>
  import Plan from 'com/pub/ToPlan'
  export default {
    name: 'MoveToPlanList',
    components: {
      'r-plan': Plan
    },
    data () {
      return {
        arr: []
      }
    },
    computed: {
      planItems () {
        return this.$store.state.planList
      },
      planCount () {
        return this.planItems.length > 8
      }
    },
    watch: {
      planItems (newId) {
        this.arr = [...newId]
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '选择计划'})
      this.$store.dispatch('getPlan').then((res) => {
        this.$store.commit('SAVE_PLANS', res)
      })
    },
    methods: {
      toCreate () {
        this.$router.replace('/plan/create')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .plan-count{
    margin-bottom: 1.5rem;
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
</style>
