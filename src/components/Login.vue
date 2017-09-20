<template>
  <div class="login-form">
    <div class="form">
      <div class="form-control">
        <div class="form-label">用户名</div>
        <div class="form-field">
          <input class="bordered" type="text" id="username" placeholder="请输入用户名" v-model="username"/>
        </div>
      </div>
      <div class="form-control">
        <div class="form-label">密码</div>
        <div class="form-field">
          <input class="bordered" type="password" id="password" placeholder="请输入密码" v-model="password"/>
        </div>
      </div>
      <v-touch class="form-control" @tap="doLogin">
        <input class="u-full-width" type="button" value="登录" />
      </v-touch>
      <v-touch class="form-control" @tap="doLogout">
        <input class="u-full-width" type="button" value="注销"/>
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
//  import eventBus from 'ut/eventBus'
//  import converter from 'ut/converter'
  import def from 'ut/defaultUtil'

  export default {
    data () {
      return {
        username: 'www123@qq.com',
        password: '123456'
      }
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
//        console.log(JSON.stringify(this.$store.state.pub.currentTodoAlert))
        console.log(JSON.stringify(this.$store.state.todo.currentTodo))
      },
      doLogin () {
//        this.$store.commit('PUB_TODO_ALERT_SET', {data: this.mockAlertData()})
//        this.$router.push('/todoEdit/alert')
//        var stateTodoTime = converter.todoTimeBack2Front(def.defaultTodo)
//        this.$store.commit('PUB_TODO_TIME_SET', {data: stateTodoTime})
        this.$router.push('/todoEdit/time')

//        this.$store.dispatch('login', { username: this.username, password: this.password })
//            .then((res) => {
//              this.$router.replace('/')
//            })
      },
      doLogout () {
        this.$store.dispatch('logout')
      },
      eventHandler (result) {
        alert(JSON.stringify(result))
      }
    },
    mounted () {
      this.$store.commit('SCH_TODO_READY', {strCurrentDate: '2017-09-20', items: []})
      this.$store.commit('TD_CURRENT_TODO_SET', {item: def.defaultTodo()})

//      eventBus.$on('todo-edit-time-ready', this.eventHandler)
      setTimeout(() => {
//        this.doLogin()
      })
    },
    beforeDestroy () {
//      eventBus.$off('todo-edit-time-ready', this.eventHandler)
    }
  }
</script>
