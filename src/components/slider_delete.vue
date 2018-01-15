<template>
  <div class="delete">
    <div class="slider">
      <div class="content"
           @touchstart='touchStart'
           @touchmove='touchMove'
           @touchend='touchEnd'
           :style='deleteSlider'
      >
        <slot></slot>
        <div class="remove" ref='remove' @click="handleClick">
          <span>删除</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      propE: {
        type: Object,
        default: function () {
        }
      }
    },
    data () {
      return {
        startX: 0,
        endX: 0,
        moveX: 0,
        disX: 0,
        deleteSlider: ''
      }
    },

    methods: {
      handleClick (v) {
        this.$emit('msg-from-child', this.val)
        this.deleteSlider = 'transform:translateX(0px)'
      },
      touchStart (ev) {
//        console.log('进入touchStart')
        ev = ev || event
        if (ev.touches.length === 1) {
          // 记录开始位置
          this.startX = ev.touches[0].clientX
        }
      },
      touchMove (ev) {
//        console.log('进入touchMove')
        ev = ev || event
        let wd = this.$refs.remove.offsetWidth
        if (ev.touches.length === 1) {
          // 滑动时距离浏览器左侧实时距离
          this.moveX = ev.touches[0].clientX
          this.disX = this.startX - this.moveX
          // 如果是向右滑动或者不滑动，不改变滑块的位置
          if (this.disX < 0 || this.disX === 0) {
            this.deleteSlider = 'transform:translateX(0px)'
            // 大于0，表示左滑了，此时滑块开始滑动
          } else if (this.disX > 0) {
            this.deleteSlider = 'transform:translateX(-' + this.disX * 5 + 'px)'
            // 最大也只能等于删除按钮宽度
            if (this.disX * 5 >= wd) {
              this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
            }
          }
        }
      },
      touchEnd (ev) {
//        console.log('进入touchEnd')
        ev = ev || event
//        console.log(ev)
        let wd = this.$refs.remove.offsetWidth
        console.log('wd' + wd)
        if (ev.changedTouches.length === 1) {
          let endX = ev.changedTouches[0].clientX
          this.disX = this.startX - endX
          if ((this.disX * 5) < (wd / 2)) {
            console.log('不到一半' + this.disX)
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            console.log('超过一半' + this.disX)
            this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
          }
        }
      }
    }
  }
</script>
<style scoped>
  .slider {
    width: 140%;
    height: 1.612rem;
    position: relative;
    user-select: none;
  }
    .content{
      display: flex;
      align-items: center;
      height: 1.612rem;
      /*position: absolute;*/
      /*left: 0;*/
      /*right: 0;*/
      /*top: 0;*/
      /*bottom: 0;*/
      /*background:green;*/
      z-index: 100;
      //  设置过渡动画
      transition: 2s;

    }
    .remove{
      /*position: absolute;*/
      /*width:1.84rem;*/
      /*height:1.6rem;*/
      width: 1.84rem;
      height: 1.5rem;
      background:red;
      /*right: 0;*/
      /*top: 0;*/
      color:#fff;
      text-align: center;
      font-size: 17px;
      /*line-height: 100px;*/
    }

</style>
