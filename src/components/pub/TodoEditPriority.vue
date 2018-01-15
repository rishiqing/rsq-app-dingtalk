<template>
  <ul>
    <li v-for="item in itemArray" class="priorityList" @click="changeIndex(item)" :class="{'IEBorder': IEcolor(item), 'IUBorder': IUcolor(item), 'UEBorder': UEcolor(item), 'UUBorder': UUcolor(item)}">
      <span :class="{'IEcolor': IEcolor(item), 'IUcolor': IUcolor(item), 'UEcolor': UEcolor(item), 'UUcolor': UUcolor(item)}" class="text">{{item.text}}</span>
      <i class="icon2-selected selected" v-show="item.index === currentIndex"></i>
    </li>
  </ul>
</template>
<script>
  export default {
    data () {
      return {
        itemArray: [
          {pContainer: 'IE', text: '重要且紧急', index: 1},
          {pContainer: 'IU', text: '重要不紧急', index: 2},
          {pContainer: 'UE', text: '紧急不重要', index: 3},
          {pContainer: 'UU', text: '不重要不紧急', index: 4}
        ],
        currentIndex: ''
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.currentTodo
      }
    },
    methods: {
      changeIndex (item) {
        this.currentIndex = item.index
      },
      IEcolor (item) {
        return item.pContainer === 'IE'
      },
      IUcolor (item) {
        return item.pContainer === 'IU'
      },
      UEcolor (item) {
        return item.pContainer === 'UE'
      },
      UUcolor (item) {
        return item.pContainer === 'UU'
      }
    },
    mounted () {
      if (this.currentTodo.pContainer === 'IE') {
        this.currentIndex = 1
      } else if (this.currentTodo.pContainer === 'IU') {
        this.currentIndex = 2
      } else if (this.currentTodo.pContainer === 'UE') {
        this.currentIndex = 3
      } else if (this.currentTodo.pContainer === 'UU') {
        this.currentIndex = 4
      }
    }
  }
</script>
<style>
  .selected{
    color: #3B9BFB;
    font-size: 14px;
    margin-right: 0.3rem;
  }
  .priorityList{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.3rem;
  }
  .text{
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
  .IEBorder{
    border-left: 4px solid  #F25643;
  }
  .IUBorder{
    border-left: 4px solid  #F0C02B;
  }
  .UEBorder{
    border-left: 4px solid  #7FBDF2;
  }
  .UUBorder{
    border-left: 4px solid  #ABF27F;
  }
  .IEcolor{
    color: #F25643;
  }
  .IUcolor{
    color: #F0C02B;
  }
  .UEcolor{
    color: #7FBDF2;
  }
  .UUcolor {
    color: #ABF27F;
  }
</style>
