<template>
  <!--用来测试用的页面，不应用在生产环境中-->
  <div class="login-form">
    <p>测试首页</p>
    <div class="form">
      <v-touch class="form-control" @tap="doEnter">
        <input class="u-full-width" type="button" value="进入Demo" />
      </v-touch>
      <v-touch class="form-control" @tap="logState">
        <input class="u-full-width" type="button" value="log state"/>
      </v-touch>
    </div>
  </div>
</template>
<style lang="scss">
  .login-form {
    position: absolute;left: 10%;width: 80%;top: 20%;background: #f8f8f8;padding: 10px;
  }
</style>
<script>
  import def from 'ut/defaultUtil'
  import moment from 'moment'

  export default {
    data () {
      return {}
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      }
    },
    methods: {
      logState () {
        console.log(JSON.stringify(this.currentTodo))
        console.log(JSON.stringify(this.currentTodo.clock))
      },
      doEnter () {
        //  模拟初始数据
        this.$store.commit('SCH_TODO_READY', {strCurrentDate: moment().format('YYYY-MM-DD'), items: []})
        this.$store.commit('TD_CURRENT_TODO_SET', {item: def.defaultTodo()})

        //  测试显示time
        this.$router.push('/demo')
      }
    },
    mounted () {},
    beforeDestroy () {}
  }
</script>
