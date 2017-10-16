<template>
  <div>
    <textarea type="text" v-model="content" placeholder="输入评论" >
    </textarea>
    <div class="icon-wrap">
      <i class="icon-attachment upload-icon"></i>
    </div>
    <r-upload
      @get-file-id="setFileId"
      @remove-file-id="removeFileId"
      @ready-to-upload="isUploading"
      @finish-upload="finishUpload"
    ></r-upload>
  </div>
</template>
<style scoped>
  .icon-wrap{
    position: relative;

  }
  .upload-icon{
    font-size: 26px;
    color:#a3a3a3;
    position: absolute;
    bottom:0.7rem;
    left:0.4rem;
  }
  li{
    position: relative;
    border-bottom: 0.5px solid #E3E3E3;
    line-height: 1.173rem;
    padding-left: 0.4rem;
  }
  textarea{
    display: inline-block;
    padding-left:10px ;
    padding-top:5px ;
    height: 200px;
    width: 100%;
    margin-top: 10px;
  }
  ul{
    border-bottom: 0.5px solid #E3E3E3;
    border-top: 0.5px solid #E3E3E3;
    background-color: white;
  }
  .close{
    position: absolute;
    top:31%;
    right:8%;
    color: #DEDEDE;
    font-size: 17px;
  }
  .file{
    position: absolute;
    top:4.468rem;
    left:0.4rem;
    color: #3D3D3D;
    font-size:20px;
  }
  .img{
    color: #3D3D3D;
    position: absolute;
    left:2rem;
    top:4.468rem;
    font-size:20px;
  }
</style>
<script>
  import Upload from 'com/pub/Upload'
  export default {
    name: 'coment',
    props: {
    },
    data () {
      return {
        content: '',
        fileId: [],
        fileName: [],
        uploadingFile: []
      }
    },
    components: {
      'r-upload': Upload
    },
    computed: {
    },
    methods: {
      setFileId (p) {
        this.fileId.push(p.id)
        this.fileName.push(p.name)
      },
      removeFileId (name) {
        for (var i = 0; i < this.fileName.length; i++) {
          if (this.fileName[i] === name) {
            this.fileId.splice(i, 1)
            this.fileName.splice(i, 1)
          }
        }
      },
      comentBlur (newTitle) {
//        if (!newTitle) {
//          return window.rsqadmg.execute('alert', {message: '任务评论不能为空'})
//        }
        var that = this
        this.$store.dispatch('postTodoComment', {commentContent: newTitle, fileIds: this.fileId})
          .then(() => {
            that.$router.replace(window.history.back())
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '保存成功'})
          })
      },
      isUploading (array) {
        this.uploadingFile = array
      },
      finishUpload () {
        this.uploadingFile = []
      }
    },
    mounted () {
      var that = this
      window.rsqadmg.execute('setTitle', {title: '评论'})
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'sendComent', name: '发送'}],
        success (res) {
          if (res.key === 'sendComent') {
            if (that.uploadingFile.length > 0) {
              window.rsqadmg.exec('confirm', {
                message: '还有未上传完成的附件，确定发送？',
                success: function () {
                  that.comentBlur(that.content)
                }
              })
            } else {
              that.comentBlur(that.content)
            }
          }
        }
      })
    }
  }
</script>
