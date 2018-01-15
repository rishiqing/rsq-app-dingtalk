<template>
  <v-touch @tap="toPriority">
    <div class="priority">
      <div class="firGroup">
        <i class="icon2-four-quadrant priority-icon"></i>
        <span class="word-priority">优先级</span>
      </div>
      <div class="secGroup">
        <span class="priority-select">{{priority}}</span>
        <i class="icon2-arrow-right arrow"></i>
      </div>
    </div>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        priority: ''
      }
    },
    props: {
      newPriority: Boolean
    },
    methods: {
      toPriority () {
        this.$router.push('/pub/TodoEditPriority')
      }
    },
    mounted () {
      if (this.newPriority) {
        this.priority = '重要且紧急'
      }
    }

  }
</script>
<style>
  .arrow{
    color: #999999;
    font-size: 16px;
    color: rgba(25,31,37,0.28);
  }
  .secGroup{
    margin-right: 0.3rem;
  }
  .firGroup{
    margin-left: 0.3rem;
  }
  .priority-icon {
    color: #3296FA;
    font-size: 16px;
  }
  .priority{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.3rem;
    background-color: white;
    border-bottom: 0 solid #E0E0E0;
  }
  .arrow-down{
    font-size: 14px;
  }
  .word-priority, .priority-select{
    font-size: 17px;
  }
</style>
