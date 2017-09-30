<template>
  <div>
    <div class="s-head">
      <p>这是固定住的head</p>
    </div>
    <div class="s-body">
      <p>滚动内容</p>
      <v-touch class="tap-area">点击我</v-touch>
    </div>
    <div class="s-foot">
      <p>这是固定住的foot</p>
    </div>
  </div>
</template>
<style>
  .s-head {position: fixed;top:0;left:0;right:0;height:50px;background:#F00;}
  .s-foot {position: fixed;bottom:0;left:0;right:0;height:50px;background:#0F0;}
  .s-body {width:100%;height:1000px;background:#FFF;padding:50px 0;}
  .tap-area {width:100%;height:50px;line-height:50px;background:#FFF;font-size:14px;text-align:center;
  }
  .tap-area:active {background:#AAA;color:#FFF;}
</style>
<script>
  export default {
    data () {
      return {}
    },
    methods: {},
    created () {
//      window.dd.ui.pullToRefresh.enable({
//        onSuccess: function () {
//          setTimeout(function () {
//            window.dd.ui.pullToRefresh.stop()
//          }, 1000)
//        },
//        onFail: function (err) {
//          alert(err)
//        }
//      })
    }
  }
</script>
