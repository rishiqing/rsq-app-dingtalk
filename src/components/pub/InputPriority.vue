<template>
  <v-touch @tap="toPriority">
    <div :class="{'new-priority':newPriority, 'edit-priority': editPriority}" class="outer-priority">
      <div class="firGroup">
        <i class="icon2-four-quadrant priority-icon"></i>
        <span class="word-priority" v-show="!editPriority">优先级</span>
      </div>
      <div class="secGroup" :class="{'new-secGroup':newPriority, 'edit-secGroup': editPriority}">
        <span class="priority-select" :class="{'new-color':newPriority, 'edit-color': editPriority}">{{priority}}</span>
        <i class="icon2-arrow-right arrow-priority"></i>
      </div>
    </div>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    props: {
      newPriority: Boolean,
      editPriority: Boolean,
      PriorityKind: String
    },
    computed: {
      priority () {
        if (this.PriorityKind) {
          if (this.PriorityKind === 'IE') {
            return '重要且紧急'
          } else if (this.PriorityKind === 'IU') {
            return '重要不紧急'
          } else if (this.PriorityKind === 'UE') {
            return '紧急不重要'
          } else if (this.PriorityKind === 'UU') {
            return '不重要不紧急'
          }
        } else {
          return this.$store.state.priority
        }
      }
    },
    methods: {
      toPriority () {
        if (this.newPriority) {
          this.$store.commit('PRIORITYSTATE', {state: 'newPriority'})
        } else {
          this.$store.commit('PRIORITYSTATE', {state: 'editPriority'})
        }
        this.$router.push('/pub/TodoEditPriority')
      }
    },
    mounted () {
//      if (this.newPriority) {
//        this.priority = '重要且紧急'
//      }
    }

  }
</script>
<style>
  .outer-priority{
    position: relative;
  }
  .arrow-priority{
    /*color: #999999;*/
    font-size: 16px;
    color: rgba(25,31,37,0.28);
    position: absolute;
    top: 0.4rem;
    right:0.3rem;
  }
  .secGroup{
    /*margin-left: 0.3rem;*/
    display: flex;
    align-items: center;
  }
  .new-secGroup{
    margin-right: 0.9rem;
  }
  .edit-secGroup{
    margin-left: 0.3rem;
  }
  .firGroup{
    /*margin-left: 0.3rem;*/
    display: flex;
    align-items: center;
  }
  .priority-icon {
    color: #3296FA;
    font-size: 16px;
  }
  .new-priority{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.3rem;
    height: 1.3rem;
    background-color: white;
    border-bottom: 1px solid #E0E0E0;
  }
  .edit-priority {
    display: flex;
    align-items: center;
    height: 1.3rem;
    background-color: white;
    /*border-bottom: 1px solid #E0E0E0;*/
  }
  .arrow-down{
    font-size: 14px;
  }
  .word-priority, .priority-select{
    font-size: 17px;
  }
  .word-priority{
    margin-left: 0.3rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #191F25;
  }
  .priority-select{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    /*color: #8C8C8C;*/
  }
  .new-color{
    color: #8C8C8C;
  }
  .edit-color{
    color: #3D3D3D;
  }
</style>
