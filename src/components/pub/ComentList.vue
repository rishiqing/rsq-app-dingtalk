<template>
  <div>
    <ul class="comentlist">
      <v-touch @tap="changeState()">
        <div :class="{'isDisplay': !more}" class="operation">收起操作记录</div>
        <div :class="{'isDisplay': more}" class="operation">显示操作记录</div>
      </v-touch>
      <r-record-coment
        v-for="item in recordItems"
        :disabled="disabled"
        :item="item"
        :key="item.id"
        :more="more"
      ></r-record-coment>
      <r-todo-coment
        v-for="item in commentItems"
        :disabled="disabled"
        :item="item"
        :key="item.id"
        @comment-file-touch="showAction"
      ></r-todo-coment>
      <div v-if="comentCount" class="noComent">
        <img src="../../assets/img/nocoment.png" alt="">
        <p class="noComentContent">暂无评论</p>
      </div>
    </ul>
    <div class="preview" v-show="previewImage.id">
      <div class="preview-mask"></div>
      <div class="preview-head">
        <div class="preview-title">{{fileName}}</div>
        <v-touch class="preview-close" @tap="closePreview">×</v-touch>
      </div>
      <div class="preview-img-wrap">
        <img class="preview-img"
             :src="previewImage.realPath"
             :alt="fileName">
      </div>
    </div>
  </div>
</template>
<style>
  .noComent{
    text-align: center;
    height: 5.479rem;
  }
  .noComent>img{
    width: 44px;
    height:44px ;
    margin-top: 1.6rem;
  }
  .noComentContent{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .isDisplay{
    display: none;
  }
  .comentlist{
    background-color: white;
    margin-top: 10px;
    margin-bottom: 1.4rem;
    /*border-top: 1px solid #E0E0E0;*/
  }
  .operation{
    line-height:1.083rem;
    padding-left: 0.333rem;
    font-family: PingFangSC-Regular;
    color:#55A8FD;
    font-size:15px ;
    background-color: white;
    border-bottom: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .preview {}
  .preview-mask {position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.9);opacity: 0.8;z-index:1500;}
  .preview-head {position: fixed;top: 0;left: 0;width: 100%;overflow:hidden;
    text-align: center;cursor: default;background: rgba(0,0,0,.86);z-index: 1530;}
  .preview-close {
    position:fixed;width: 0.8rem;height: 0.8rem;
    border-radius: 50%;line-height: 0.8rem;
    top: 0.35rem;right: 0.35rem;
    color: #000;background: #fff;
  }
  .preview-title {text-align:center;width: 80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;
    margin:0 auto;font-size: 16px;height:1.5rem;line-height:1.5rem;}
  .preview-img-wrap {position:fixed;left:10%;top:1.5rem;right:10%;bottom:1.5rem;overflow:auto;z-index:1520;}
  .preview-img {display:block;position:relative;width: 100%;z-index: 1521;}
</style>
<script>
  import util from 'ut/jsUtil'
  import ComentItem from 'com/pub/ComentItem'
  import comentRecord from 'com/pub/comentRecord'
  export default {
    data () {
      return {
        previewFile: {},
        previewImage: {},
        more: false
      }
    },
    name: 'ComentList',
    props: {
      disabled: Boolean,
      items: Array,
      commentContent: String
    },
    components: {
      'r-todo-coment': ComentItem,
      'r-record-coment': comentRecord
    },
    computed: {
      fileName (file) {
        if (!file.name) return ''
        var arr = file.name.split('/')
        return arr[arr.length - 1].substr(14)
      },
      recordItems () {
        return this.items.filter(i => {
          return i.type !== 0
        })
      },
      commentItems () {
        return this.items.filter(i => {
          return i.type === 0
        })
      },
      comentCount () {
        if (this.items === undefined) {
          return
        } else {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].type === 0) {
              return false
            }
          }
          return true
        }
      },
      isImage (type) {
        return util.isImage(type)
      },
      isFileCanPreview (type) {
        return util.isFileCanPreview(type)
      }
    },
    methods: {
      changeState () {
        this.more = !this.more
      },
      showAction (f) {
        var that = this
        window.rsqadmg.exec('actionsheet', {
          buttonArray: ['预览文件', '下载文件'],
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                if (util.isImage(f.contentType)) {
                  that.previewImage = f
                } else if (util.isFileCanPreview(f.contentType)) {
                  that.previewFile = f
                } else {
                  window.rsqadmg.exec('alert', {message: '文件格式不支持预览'})
                }
                break
              case 1:
                that.downloadFile(f)
                break
              default:
                break
            }
          }
        })
      },
      closePreview (e) {
        this.previewImage = {}
        e.preventDefault()
      },
      downloadFile (f) {
        var link = document.createElement('a')
        link.download = this.fileName
        link.href = f.realPath
        link.click()
      }
    }
  }
</script>
