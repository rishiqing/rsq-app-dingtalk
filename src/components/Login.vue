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
  export default {
    data () {
      return {
        username: 'www123@qq.com',
        password: '123456'
      }
    },
    computed: {},
    methods: {
      doLogin () {
        this.$store.dispatch('login', { username: this.username, password: this.password })
            .then((res) => {
              this.$router.replace('/')
            })
      },
      doLogout () {
        this.$store.dispatch('logout')
      }
    },
    mounted () {}
  }
</script>
