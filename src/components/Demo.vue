<template>
  <!--用来测试用的页面，不应用在生产环境中-->
  <div class="login-form">
    <div class="form">
      <v-touch class="form-control" @tap="doEnter">
        <input class="u-full-width" type="button" value="进入" />
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
      mockAlertData () {
        var obj = this.$store.state.pub.currentTodoAlert

        return {
          //  规则列表
          //  {id: 123, schedule: 'begin_-1_min', isUserDefined: false}
          ruleList: obj.ruleList || [],
          //  用户自定义的时间列表
          //  {numTime: 1234123421321}
          timeList: obj.timeList || []
        }
      },
      mockTimeData () {
        var obj = this.$store.state.pub.currentTodoTime
        return {
          isAllDay: true,
          clock: {
            startTime: obj.startTime,
            endTime: obj.endTime,
            alert: []
          }
        }
      },
      logState () {
        console.log(JSON.stringify(this.currentTodo))
        console.log(JSON.stringify(this.currentTodo.clock))
      },
      doEnter () {
        //  模拟初始数据
        this.$store.commit('SCH_TODO_READY', {strCurrentDate: '2017-09-20', items: []})
        this.$store.commit('TD_CURRENT_TODO_SET', {item: def.defaultTodo()})

        //  测试显示time
        this.$router.push('/todoEdit/time')

//        //  login方法
//        this.$store.dispatch('login', { username: this.username, password: this.password })
//            .then((res) => {
//              this.$router.replace('/')
//            })
      }
    },
    mounted () {},
    beforeDestroy () {}
  }
</script>
