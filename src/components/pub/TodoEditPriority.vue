<template>
  <ul class="priority-outer">
      <li v-for="item in itemArray" :class="{'IEBorder': IEcolor(item), 'IUBorder': IUcolor(item), 'UEBorder': UEcolor(item), 'UUBorder': UUcolor(item)}">
        <v-touch @tap="changeIndex(item)" class="priorityList">
          <span :class="{'IEcolor': IEcolor(item), 'IUcolor': IUcolor(item), 'UEcolor': UEcolor(item), 'UUcolor': UUcolor(item)}" class="text">{{item.text}}</span>
          <i class="icon2-selected selected" v-show="item.index === currentIndex"></i>
        </v-touch>
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
    props: {
      editPriority: Boolean
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      priority () {
        return this.$store.state.priority
      },
      priorityState () {
        return this.$store.state.priorityState
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
    created () {
      window.rsqadmg.execute('setTitle', {title: '优先级'})
      var btnParams
      var that = this
      btnParams = {
        btns: [{key: 'submitTodo', name: '确定'}],
        success: function (res) {
          if (res.key === 'submitTodo') {
            if (that.priorityState === 'newPriority') {
              that.$store.commit('CHANGE_PRIORITY', {text: that.itemArray[that.currentIndex - 1].text})
//              that.$router.replace('/todo/new/schedule')
              that.$router.replace(window.history.back())
            } else {
//              console.log(that.currentTodo.id)
              that.$store.dispatch('changePriority', {id: that.currentTodo.id, pContainer: that.itemArray[that.currentIndex - 1].pContainer}).then(
                () => {
                }
              )
              that.$router.replace('/todo/' + that.currentTodo.id)
            }
          }
        }
      }
      window.rsqadmg.execute('setOptionButtons', btnParams)
    },
    mounted () {
      if (!this.currentTodo) {
        if (this.priority === '重要且紧急') {
          this.currentIndex = 1
        } else if (this.priority === '重要不紧急') {
          this.currentIndex = 2
        } else if (this.priority === '紧急不重要') {
          this.currentIndex = 3
        } else if (this.priority === '不重要不紧急') {
          this.currentIndex = 4
        }
      } else {
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
  }
</script>
<style>
  .priority-outer{
    margin-top: 0.5rem;
    border-top: 1px solid #E0E0E0;
  }
  .selected{
    color: #3B9BFB;
    font-size: 14px;
    margin-right: 0.3rem;
  }
  .priorityList{
    display: flex;
    align-items: center;
    height: 1.466rem;
    justify-content: space-between;
    padding-left: 0.3rem;
    border-bottom: 1px solid #E0E0E0;
    background: #FFFFFF;
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
