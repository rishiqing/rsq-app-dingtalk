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

  export default {
    data () {
      return {
        username: 'www123@qq.com',
        password: '123456'
      }
    },
    methods: {
      doLogin () {
//        this.$store.commit('SCH_TODO_READY', {strCurrentDate: '2017-09-16', items: []})
//        this.$store.commit('PUB_SET_TODO_REPEAT', null)
        this.$store.commit('PUB_SET_TODO_TIME', {
          isAllDay: true,
          todo: null
        })
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
//      eventBus.$on('todo-edit-time-ready', this.eventHandler)
      setTimeout(() => {
        this.doLogin()
      })
    },
    beforeDestroy () {
//      eventBus.$off('todo-edit-time-ready', this.eventHandler)
    }
  }
</script>
