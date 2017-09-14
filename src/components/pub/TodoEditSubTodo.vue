<template>
  <div>subTodo</div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {}
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '子任务'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    }
  }
</script>
