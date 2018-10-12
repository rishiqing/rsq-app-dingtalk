<template>
  <div class="delete">
    <div class="slider">
      <div
        ref="slider"
        :style="deleteSlider"
        class="content"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd">
        <slot />
        <v-touch @tap="deleteItem()">
          <div
            ref="remove"
            class="remove">
            <span>删除</span>
          </div>
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'SliderDelete',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        startX: 0,
        endX: 0,
        moveX: 0,
        disX: 0,
        deleteSlider: '',
        threshold: 0,  //  50的敏感度，在滑动访问为50以内，不进行显示滑动删除
        throttle: null,
        startx: 0,
        starty: 0,
        directionFristTouch: true,
        sliderD: null
      }
    },
    computed: {
      sliderId () {
        return this.$store.state.pub.sliderId
      }
    },
    watch: {
      sliderId (newId) {
        if (newId !== this.item.id) {
          this.$refs.slider.style.transform = ''
        }
      }
    },
    mounted () {
      this.$store.commit('SLIDER_MARK', { mark: null })
    },
    methods: {
      getDirection (startx, starty, endx, endy) {
        var angx = endx - startx
        var angy = endy - starty
        var result = 0
        // 如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
          return result
        }
        var angle = this.getAngle(angx, angy)
        if (angle >= -135 && angle <= -45) {
          result = 1
        } else if (angle > 45 && angle < 135) {
          result = 2
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 3
        } else if (angle >= -45 && angle <= 45) {
          result = 4
        }
        return result
      },
      getAngle (angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI
      },
      touchStart (ev) {
        ev = ev || event
        if (ev.touches.length === 1) {
          // 记录开始位置
          this.startX = ev.touches[0].clientX
        }
        this.startx = ev.touches[0].pageX
        this.starty = ev.touches[0].pageY
      },
      touchMove (ev) {
        if (!this.$refs.remove) {
          return
        }
        ev = ev || event
        if (this.directionFristTouch) {
          var endx = ev.changedTouches[0].pageX
          var endy = ev.changedTouches[0].pageY
          var direction = this.getDirection(this.startx, this.starty, endx, endy)
          if (direction === 2 || direction === 1) {
            this.sliderD = 'UD'
          }
          this.directionFristTouch = false
        }
        if (this.sliderD === 'UD') {
          return
        }
        let wd = this.$refs.remove.offsetWidth
        if (ev.touches.length === 1) {
          // 滑动时距离浏览器左侧实时距离
          this.moveX = ev.touches[0].clientX
          this.disX = this.startX - this.moveX
          // 如果是向右滑动或者不滑动，不改变滑块的位置
          if (Math.abs(this.disX) <= this.threshold) {
            return
          }
          if (this.disX < 0 || this.disX === 0) {
            this.deleteSlider = 'transform:translateX(0px)'
          } else if (this.disX > 0) {
            this.deleteSlider = 'transform:translateX(-' + this.disX * 5 + 'px)'
            if (this.disX * 5 >= wd) {
              this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
              this.shrink()
            }
          }
        }
      },
      touchEnd (ev) {
        if (!this.$refs.remove) {
          return
        }
        ev = ev || event
        this.directionFristTouch = true
        if (this.sliderD === 'UD') {
          this.sliderD = null
          return
        }
        this.sliderD = null
        let wd = this.$refs.remove.offsetWidth
        if (ev.changedTouches.length === 1) {
          let endX = ev.changedTouches[0].clientX
          this.disX = this.startX - endX
          if (Math.abs(this.disX) <= this.threshold) {
            return
          }
          if ((this.disX * 5) < (wd / 2)) {
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            this.deleteSlider = 'transform:translateX(-' + wd + 'px)'
          }
        }
        this.throttle = null
        this.sliderD = null
      },
      deleteItem () {
        this.$emit('deleteItem')
      },
      shrink () {
        var that = this
        clearTimeout(this.throttle)
        this.throttle = setTimeout(() => {
          if (that.sliderId === that.item.id) {
            return
          }
          that.$store.commit('SLIDER_MARK', { mark: that.item.id })
        }, 100)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .slider {
    width: 120%;
    /*height: 20px;*/
    /*height: 200px;*/
    position: relative;
    /*display: flex;*/
    /*align-items: center;*/
    user-select: none;
  }
  .slider  .content{
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*background:green;*/
    z-index: 100;
  transition: transform 0.3s;
    width: 120%;
    display: flex;
    align-items: center;
  }
  .slider  .remove{
    /*position: absolute;*/
    width:2rem;
    height:56px;
    background:red;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #FFFFFF;
  }

</style>
