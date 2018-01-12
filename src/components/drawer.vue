<template>
  <div>
  <v-touch @tap="come">
    <button>出来</button>
  </v-touch>
  <div class="test" :class="{'come': appear}">哈哈</div>
  </div>
</template>
<style>
  .test{
    width: 100%;
    height:100px;
    background-color: yellow;
    position: absolute;
    bottom: -100px;
    transition: 0.1s;
  }
  .come{
    bottom: 0;
  }
</style>
<script>
  export default{
    data () {
      return {
        appear: false
      }
    },
    methods: {
      come () {
        this.appear = !this.appear
      }
    }
  }
</script>
