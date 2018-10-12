<template>
  <v-touch @tap="delayCallFix">
    <div
      class="outer-wrap bottom-border" >
      <span class="inner-key">{{ planName }}</span>
      <i class="icon2-arrow-right-small arrow"/>
    </div>
  </v-touch>
</template>
<script>
  export default {
    name: 'MoveToPlan',
    props: {
      item: {
        type: Object,
        required: true
      },
      plan: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    computed: {
      kanbanItem () {
        if (this.plan) {
          return this.$store.state.plan.currentKanbanItem
        } else {
          return this.$store.state.todo.currentTodo.kanbanItem
        }
      },
      childPlanName () {
        if (this.plan) {
          return this.kanbanItem.childKanbanName
        } else {
          return this.$store.state.todo.currentTodo.from.levelFourName
        }
      },
      cardName () {
        return this.kanbanItem.kanbanCardName
      },
      planName () {
        if (this.kanbanItem) {
          return this.kanbanItem.kanbanName + '，' + this.childPlanName + '，' + this.cardName
        } else {
          return '添加到计划'
        }
      }
    },
    methods: {
      delayCallFix (e) {
        window.setTimeout(() => {
          this.moveToPlan(e)
        }, 50)
      },
      moveToPlan () {
        if (this.plan && this.kanbanItem.editControl.move) {
          this.$router.push({ name: 'MoveToPlan', query: {target: 'plan'} })
        } else if (!this.plan && this.$store.state.todo.currentTodo.editControl.from) {
          this.$router.push('/sche/todo/move')
        } else {
          window.rsqadmg.exec('alert', {message: '您非该任务创建者，无法进行此操作！'})
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 56px;
    background-color: transparent;
  }
  .inner-key{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 80%;
  }
  .has-padding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left: 1.3rem;
  }
  .bottom-border{
    // border-bottom: 1px solid #E0E0E0;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    height: 100%;
    line-height: 56px;
    right: 0.2rem;
}
</style>
