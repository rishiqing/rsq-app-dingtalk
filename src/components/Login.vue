<template>
  <div class="login-form">
    <div class="form">
      <div class="form-control">
        <div class="form-label">用户名</div>
        <div class="form-field">
          <input
            id="username"
            v-model="username"
            class="bordered"
            type="text"
            placeholder="请输入用户名">
        </div>
      </div>
      <div class="form-control">
        <div class="form-label">密码</div>
        <div class="form-field">
          <input
            id="password"
            v-model="password"
            class="bordered"
            type="password"
            placeholder="请输入密码">
        </div>
      </div>
      <v-touch
        class="form-control"
        @tap="doLogin">
        <input
          class="u-full-width"
          type="button"
          value="登录">
      </v-touch>
      <v-touch
        class="form-control"
        @tap="doLogout">
        <input
          class="u-full-width"
          type="button"
          value="注销">
      </v-touch>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Login',
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
    }
  }
</script>
<style lang="scss" scoped>
  .login-form {
    position: absolute;left: 10%;width: 80%;top: 20%;background: #f5f5f5;padding: 10px;
  }
</style>
