<template>
  <div class="repeatKind">
    <div class="kind-head">
      <v-touch @tap="cancel" class="kind-head">
        <span class="cancel">取消</span>
      </v-touch>
      <span class="title distance">重复周期</span>
    </div>
    <div class="wrap-list">
      <div v-for="item in this.everydata">
        <v-touch @tap="gotokind(item)" class="repeatStyle first">
          {{item.text}}
        </v-touch>
      </div>
    </div>
  </div>
</template>
<style>
  .wrap-list{
    padding-left: 0.6rem;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .distance{
    margin-left: 3rem;
  }
  .kind-head{
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-left: 0.3rem;
  }
  .dp-selected {
    background: #55A8FD !important;
    color:white;
  }
</style>
<script>
  export default {
    data () {
      return {
        everydata: [
          {text: '每天', type: 'everyDay'},
          {text: '每周', type: 'everyWeek'},
          {text: '每月', type: 'everyMonth'},
          {text: '每年', type: 'everyYear'}
        ]
      }
    },
    methods: {
      cancel () {
        this.$emit('hideKind')
      },
      gotokind (item) {
        this.$emit('hideKind', item.text)
        this.$store.commit('SAVE_REPEAT', {type: 'repeatType', value: item.type})
      }
    }
  }
</script>
