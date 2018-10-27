<template>
  <div class="preview">
    <div class="preview-mask" />
    <div
      v-show="previewImage.id"
      class="preview-img-wrap">
      <div class="preview-flex">
        <div class="flex-item">
          <swiper
            ref="imgOverview"
            :key="previewImage.id"
            :options="swiperOption"
            style="height: 100%;">
            <swiper-slide>
              <p class="swiper-zoom-container">
                <img
                  :src="previewImage.realPath">
              </p>
            </swiper-slide>
          </swiper>
        </div>
        <v-touch
          class="close"
          @tap="closePreview">
          <img
            class="close-img"
            src="../../../assets/img/close-img.svg">
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    data () {
      return {
        isShow: false,
        previewImage: {},
        previewFile: {},
        swiperOption: {
          width: window.innerWidth,
          zoom: true,
          initialSlide: 0
        }
      }
    },
    computed: {
      swiper () {
        return this.$refs.imgOverview.swiper
      },
      fileName () {
        var file = this.previewImage.id ? this.previewImage : this.previewFile
        if (!file.name) return ''
        var arr = file.name.split('/')
        return arr[arr.length - 1].substr(14)
      },
      fileFramePath () {
        if (!this.previewFile.id) return ''
        return 'https://ow365.cn/?i=3169&furl=' + this.previewFile.realPath
      }
    },
    mounted () {
      var that = this
      //  如果通过任意方式跳出页面了，那么关闭当前选择框
      window.onpopstate = function () {
        that.closePreview()
      }
    },
    methods: {
      closePreview (e) {
        window.setTimeout(() => {
          this.closePreviewfix(e)
        }, 50)
      },
      more () {
        this.swiperOption = {
          width: window.innerWidth,
          zoom: true,
          initialSlide: 0
        }
      },
      closePreviewfix (e) {
        if (e) {
          e.preventDefault()
        }
        this.previewImage = {}
        this.previewFile = {}
        this.$emit('self-close')
      },
      showFilePage (f) {
        window.dd.biz.util.openLink({
          url: 'https://ow365.cn/?i=3169&furl=' + f.realPath,  //  要打开链接的地址
          onSuccess: function (result) {
          },
          onFail: function () {}
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .preview {}
  .preview-mask {position:fixed;top:0;right:0;bottom:0;left:0;background-color: #f5f5f5;z-index:1500;}
  .preview-head {position: fixed;top: 0;left: 0;width: 100%;overflow:hidden;
    text-align: center;cursor: default;background: rgba(0,0,0,.86);z-index: 1530;}
  .preview-close {
    position:fixed;
    border-radius: 50%;
    top: 0.45rem;
    right: 0.35rem;
    font-size: 22px;
    color: #fff;
    background: #000;
  }
  .preview-title {text-align:center;width: 80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;
    margin:0 auto;font-size: 16px;height:1.5rem;line-height:1.5rem;}
  .preview-img-wrap {position:fixed;left:0;top:0;right:0;bottom:0;overflow:auto;z-index:1520;transition: 1s}
  .preview-img {display:block;position:relative;width: 100%;z-index: 1521;}
  .preview-file-wrap {position:fixed;left:0%;top:1.5rem;right:0%;bottom:0rem;overflow:scroll;z-index:1520;
    -webkit-overflow-scrolling:touch;}
  .preview-file {display:block;position:relative;width: 100%;height:100%;z-index: 1521;}
  .preview-flex{
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
  }
  .close{
    height: 46px;
    flex: 0 0 auto;
    position: fixed;
    z-index: 999999;
    bottom: 0;
    width: 100%;
  }
  .flex-item{
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .close-img{
    width: 30px;
    height: 30px;
    margin: 0 auto;
    display: block;
    margin-bottom: 16px
  }
  .zoom{
    transform: scale(2);
  }
</style>
