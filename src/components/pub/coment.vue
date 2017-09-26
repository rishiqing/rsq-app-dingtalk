<template>
  <div>
    <textarea type="text" v-model="content" placeholder="输入评论" >
    </textarea>
    <i class="icon2-new-folder file"></i>
    <i class="icon2-picture2 img"></i>
    <ul>
      <li>
        <img src="http://pic61.nipic.com/file/20150309/4614066_191939440318_2.jpg" alt="">
        <span class="word">产品介绍.ppt</span>
        <i class="icon2-error close"></i>
      </li>
      <li>
        <img src="http://pic61.nipic.com/file/20150309/4614066_191939440318_2.jpg" alt="">
        <span class="word">xxxx.jpg</span>
        <i class="icon2-error close"></i>
      </li>
    </ul>

    <!--<el-upload-->
      <!--class="upload-demo"-->
      <!--action="https://jsonplaceholder.typicode.com/posts/"-->
      <!--list-type="picture">-->
      <!--<el-button size="small" type="primary">点击上传</el-button>-->
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    <!--</el-upload>-->
  </div>
</template>
<style >
  .el-upload-list__item {
    font-size: 14px;
    color: #48576a;
    line-height: 2rem;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    position: relative;
  }
  .el-upload-list{
    margin-top: -64px !important;
  }
  .el-icon-close{
    font-size: 1px;
  }
  li{
    position: relative;
    border-bottom: 0.5px solid #E3E3E3;
    height:   1.173rem;;
    line-height: 1.173rem;
    padding-left: 0.4rem;
  }
  textarea{
    display: inline-block;
    padding-left:14px ;
    padding-top:21px ;
    height: 200px;
    width: 100%;
  }
  ul{
    border-bottom: 0.5px solid #E3E3E3;
    border-top: 0.5px solid #E3E3E3;
    background-color: white;
  }
  .close{
    position: absolute;
    top:35%;
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
    left:1.5rem;
    top:4.468rem;
    font-size:20px;
  }
  img{
    width: 27px;
    height: 27px;
  }
  .word{
    position: absolute;
    top:0;
    left:1.5rem;
    font-family:AppleSystemUIFont;
    font-size: 13px;
    color: #3D3D3D;
  }
</style>
<script>
//  import $ from 'jquery'
//  $(function () {
//    $('#pic').click(function () {
//      $('#upload').click() // 隐藏了input:file样式后，点击头像就可以本地上传
//      $('#upload').on('change', function () {
//        var objUrl = getObjectURL(this.files[0]) // 获取图片的路径，该路径不是图片在本地的路径
//        if (objUrl) {
//          $('#pic').attr('src', objUrl) // 将图片路径存入src中，显示出图片
//        }
//      })
//    })
//  })
//
//  // 建立一個可存取到該file的url
//  function getObjectURL (file) {
//    var url = null
//    if (window.createObjectURL !== undefined) { // basic
//      url = window.createObjectURL(file)
//    } else if (window.URL !== undefined) { // mozilla(firefox)
//      url = window.URL.createObjectURL(file)
//    } else if (window.webkitURL !== undefined) { // webkit or chrome
//      url = window.webkitURL.createObjectURL(file)
//    }
//    return url
//  }
  export default {
    name: 'coment',
    props: {
    },
    data () {
      return {
      }
    }, // 定义事件
    methods: {
      comentBlur (newTitle) {
        if (!newTitle) {
          return window.rsqadmg.execute('alert', {message: '任务评论不能为空'})
        }
        var that = this
        this.$store.dispatch('postTodoComment', {commentContent: newTitle})
          .then(() => {
  //            this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: newTitle, type: 9}})
  //              .then(() => {
  //                this.editItem.pTitle = newTitle
  //              })
            that.$router.replace(window.history.back())
            window.rsqadmg.exec('hideLoader')
            window.rsqadmg.execute('toast', {message: '保存成功'})
          })
      }
    },
    mounted () {
        // this.initData()
      var that = this
      window.rsqadmg.execute('setTitle', {title: '评论'})
      window.rsqadmg.execute('setOptionButtons', {
        btns: [{key: 'sendComent', name: '发送'}],
        success (res) {
          if (res.key === 'sendComent') {
            that.comentBlur(that.content)
          }
        }
      })
    }
  }
</script>
