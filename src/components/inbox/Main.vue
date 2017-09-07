<template>
	<div class="">
    <input type="text" PLACEHOLDER="在这里输入"  v-model="editItem.pTitle">
    <button @click="getInboxItem"></button>
    <ul>
    <li v-for="shouna in inboxitems">
      {{shouna}}
    </li>
    </ul>
	</div>
</template>
<script>
  import dateUtil from 'ut/dateUtil'
  export default {
    data () {
      return {
        editItem: {
          pTitle: '',
          dates: null,
          startDate: null,
          endDate: null
        }
      }
    },
    methods: {
      getPlanedTime () {
        var ei = this.editItem
        var result = dateUtil.backend2frontend(ei.dates, ei.startDate, ei.endDate)
        return (result && result.dateResult) ? result.dateResult[0] : null
      },
      getInboxItem () {
//        var planTime = this.getPlanedTime()
  //          if(!planTime) {
  //            return window.rsqadmg.execute('alert', {message: '请选择任务日期'})
  //          }
        //  坑爹啊。。。格式不统一，需要做额外的hack
       // this.editItem.pPlanedTime = dateUtil.dateNum2Text(planTime, '-') + ' 00:00:00'
        this.$store.dispatch('createInboxItem', {props: this.editItem})
          .then(function () {
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '创建成功'})
//            that.$router.replace(window.history.back())
          })
      }
    },

    computed: {
      inboxitems () {
        return this.$store.state.inbox.items
      }
    },
    mounted () {
      this.$store.dispatch('setNav', true)
    }
  }
</script>
<style>
  button{
    width: 20px;
    height: 20px;
  }
</style>
