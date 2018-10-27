<template>
  <ul
    class="c-plan-list">
    <c-plan-item
      v-for="(item,index) in items"
      :key="index"
      :item="item"/>
  </ul>
</template>
<script>
  import ChildPlanItem from 'com/plan/ChildPlanItem'
  export default {
    name: 'ChildPlanItem',
    components: {
      'c-plan-item': ChildPlanItem
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .c-plan-list{
    background-color: white;
    // border-top:0.5px solid #d4d4d4 ;
    padding-left: 15px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .c-plan-list:before{
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
</style>
