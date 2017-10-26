<template>
  <v-touch id="touchList" ref="touchList"
           :enabled="enabled"
           @panstart="onPanMove"
           @panmove="onPanMove"
           @panend="onPanEnd"
           @pancancel="onPanEnd"
           :pan-options="{ direction: 'vertical', threshold: 10 }"
           class="pull-container">
    <div class="scroller">
      <div :id="pullDownId" class="pulldown"
           :class="[pullDownChangeStyle, {'animate': isShowTrans}]"
           :style="{'margin-top': pullDownMargin + 'px'}">
        <div class="pulldown-icon"></div>
        <div class="pulldown-label">{{pullDownTip}}</div>
      </div>
    </div>
    <div id="listContainer" class="list-container" style="overflow-y: auto;">
      <slot></slot>
    </div>
  </v-touch>
</template>
<style lang="scss" scoped>
  .pull-container {
    overflow: hidden;
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
  }
  .scroller{
    min-height: 101%;/*修正内容高度不够无法scroll*/
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .animate{
    transition: margin-top 0.2s linear;
  }
  .hide{
    display: none;
  }
  .pulldown {
    height: 50px;
    line-height: 50px;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 14px;
    color: #888;
    text-align: center;
    box-sizing: border-box;
  }
  .pulldown .pulldown-icon {
    display: block;
    width: 40px;
    height: 40px;
    background: url(../../assets/img/pull-icon@2x.png) 0 0 no-repeat;
    -webkit-background-size: 40px 80px;
    background-size: 40px 80px;
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 250ms;
  }
  .pulldown .pulldown-label{
    position:relative;
    top: -40px;
  }
  .pulldown .pulldown-icon {
    -webkit-transform: rotate(0deg) translateZ(0);
  }
  .pulldown.release .pulldown-icon {
    -webkit-transform: rotate(-180deg) translateZ(0);
  }
  .pulldown.refresh .pulldown-icon {
    background-position: 0 100%;
    -webkit-transition-duration: 0ms;
    -webkit-animation: spinner 3s infinite linear;
    animation: spinner 3s infinite linear;
  }
  /*通用转动动画*/
  @-webkit-keyframes spinner {
    0% { -webkit-transform: rotate(0deg); }
    50% { -webkit-transform: rotate(180deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
</style>
<script>
  const PULL_DOWN_NORMAL = '下拉刷新'
  const PULL_DOWN_RELEASE = '释放加载'
  const PULL_DOWN_LOADING = '加载中，请稍后'

  // 加载状态-1默认，0显示提示下拉信息，1显示释放刷新信息，2执行加载数据，只有当为-1时才能再次加载
  const STATE_DEFAULT = -1
  const STATE_PULL_NORMAL = 0
  const STATE_PULL_RELEASE = 1
  const STATE_PULL_LOADING = 2
//
  const STYLE_RELEASE = 'release'
  const STYLE_REFRESH = 'refresh'

  var timeoutHandler = 0
  var timeout = 3000
  var pullDownHeight = 50
  export default {
    data () {
      return {
        pullDownId: new Date().getTime(),
        isShowTrans: false,
        refreshStep: STATE_DEFAULT,
        pullDownTip: PULL_DOWN_NORMAL,
        pullDownChangeStyle: '',
        pullDownMargin: -pullDownHeight
      }
    },
    props: {
      enabled: Boolean
    },
    methods: {
      onPanMove (e) {
        var delta = e.deltaY
        this.$emit('on-list-pan-move', {deltaY: delta})
        //  不允许上拉刷新
        if (this.refreshStep === STATE_PULL_LOADING) return
        if (delta < pullDownHeight) {
          this.pullDownMargin = delta - pullDownHeight
          this.pullDownChangeStyle = ''
          this.pullDownTip = PULL_DOWN_NORMAL
          this.refreshStep = STATE_PULL_NORMAL
        } else {
          this.pullDownChangeStyle = STYLE_RELEASE
          this.pullDownTip = PULL_DOWN_RELEASE
          this.refreshStep = STATE_PULL_RELEASE
        }
      },
      onPanEnd () {
        this.showTrans(true)
        if (this.refreshStep === STATE_PULL_RELEASE) {
          this.pullDownChangeStyle = STYLE_REFRESH
          this.pullDownTip = PULL_DOWN_LOADING
          this.refreshStep = STATE_PULL_LOADING
          this.$emit('on-pull-down', this.reset)
          timeoutHandler = setTimeout(() => {
            if (this.refreshStep === STATE_PULL_LOADING) {
              this.reset()
            }
          }, timeout)
        } else if (this.refreshStep === STATE_PULL_NORMAL || this.refreshStep === STATE_DEFAULT) {
          this.reset()
        }
      },
      reset () {
        this.pullDownMargin = -pullDownHeight
        this.refreshStep = STATE_DEFAULT
        clearTimeout(timeoutHandler)
      },
      showTrans (isShow) {
        this.isShowTrans = !!isShow
      }
    },
    mounted () {
      var ele = document.getElementById(this.pullDownId)
      ele.addEventListener('transitionend', () => {
        this.showTrans(false)
      })
      ele.addEventListener('webkitTransitionEnd', () => {
        this.showTrans(false)
      })
//      console.log('=@_@===this.$refs.touchList===#_#=' + this.$refs.touchList.disable('pan'))
//      this.$refs.touchList.disable('panstart')
//      this.$refs.touchList.disable('panmove')
//      this.$refs.touchList.disable('panend')
//      this.$refs.touchList.disable('pancancel')
//      var list = document.getElementById('touchList')
//      list.style.touchAction = 'auto'
//      var list = document.getElementById('listContainer')
//      list.addEventListener('scroll', (e) => {
//        console.log('=====' + list.scrollTop)
//        e.preventDefault()
//        e.stopPropagation()
//        return false
//      })
    }
  }
</script>
