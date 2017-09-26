<template>
  <!--用来测试用的页面，不应用在生产环境中-->
  <div class="init-form">
    <p>上传文件测试</p>
    <div class="form">
      <v-touch class="form-control" @tap="logState">
        <input class="u-full-width" type="button" value="log state"/>
      </v-touch>
      <v-touch class="form-control" @tap="uploadToOSS">
        <input class="u-full-width" type="button" value="上传文件"/>
      </v-touch>
      <form id="form1">
        <div class="input-wrapper">
          <p>选择文件</p>
          <input class="file-input" type="file" id="imgInp" name="uploads[]" multiple="multiple" @change="addToTask"/>
        </div>
        <ul>
          <li v-for="t in taskList">
            <img class="preview-img" :src="t.img.src" alt="t.img.name"/>
            <p v-if="t.finished">上传完成</p>
            <p v-else>上传进度:{{t.progress}}%</p>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>
<style lang="scss">
  .init-form {
    position: absolute;left: 10%;width: 80%;top: 20%;background: #f8f8f8;padding: 10px;font-size: 16px;
  }
  .preview-img {
    width: 100px;
  }
  .input-wrapper {
    height: 32px;
    width: 64px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    /*Using a background color, but you can use a background image to represent a button*/
    background-color: #0FF;
  }
  .file-input {
    cursor: pointer;
    height: 100%;
    position:absolute;
    top: 0;
    right: 0;
    z-index: 99;
    /*This makes the button huge. If you want a bigger button, increase the font size*/
    font-size:50px;
    /*Opacity settings for all browsers*/
    opacity: 0;
    -moz-opacity: 0;
    filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)
  }
</style>
<script>
  import api from 'api/index'

  export default {
    data () {
      return {
        stsServer: window.rsqConfig.stsServer,
        bucket: 'rishiqing-file',
        ossRootPath: 'dingtalk/',
        region: 'oss-cn-beijing',
        progress: 0,
        taskList: []  //  上传任务的taskList，每个task，包括image和file两个对象
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      unfinishedTask () {
        return this.taskList.filter(t => {
          return !t.finished
        })
      }
    },
    methods: {
      logState () {
        console.log(JSON.stringify(this.currentTodo))
        console.log(JSON.stringify(this.currentTodo.clock))
      },
      //  显示图片的第一种方式
      addToTask (e) {
        var files = e.target.files
        if (files.length < 1) return
        if (this.unfinishedTask.length + files.length > 5) {
          window.rsqadmg.exec('alert', {message: '一次最多上传5张图片！'})
          return
        }
        for (var i = 0; i < files.length; i++) {
          var file = files[i]
          var url = URL.createObjectURL(file)
          this.taskList.push({
            finished: false,
            progress: 0,
            img: {
              name: file.name,
              src: url
            },
            file: file
          })
        }
      },
      //  显示图片的第二种方式
      readURL (e) {
        var input = e.target
        var that = this
        if (input.files && input.files[0]) {
          var file = input.files[0]
          var reader = new FileReader()
          reader.onload = function (e) {
            that.taskList.push({
              finished: false,
              progress: 0,
              img: {
                name: file.name,
                src: e.target.result
              },
              file: file
            })
          }
          reader.readAsDataURL(file)
        }
      },
      //  上传到阿里云OSS
      uploadToOSS () {
        var len = this.unfinishedTask.length
        this.getToken()
          .then(client => {
            //  同时上传需要做数量控制，因此不做同时上传，只做顺序上传
            return this.$store.dispatch('uploadToOSS', {
              client: client,
              path: this.ossRootPath + this.userId + '/',
              list: this.unfinishedTask
            }).then(res => {
              console.log(len + ' files upload successfully')
            })
          })
      },
      getToken () {
        var that = this
        var urllib = window.OSS.urllib
        var OSS = window.OSS.Wrapper
        return urllib.request(that.stsServer + that.userId, {
          method: 'GET'
        }).then(function (result) {
          var credential = JSON.parse(result.data)
          return new OSS({
            region: that.region,
            accessKeyId: credential.AccessKeyId,
            accessKeySecret: credential.AccessKeySecret,
            stsToken: credential.SecurityToken,
            bucket: that.bucket
          })
        })
      },
      //  上传到nodeJs服务器
      uploadToNodeJs () {
        var input = document.getElementById('imgInp')
        var files = input.files
        var formData
        if (files.length > 0) {
          // One or more files selected, process the file upload

          // create a FormData object which will be sent as the data payload in the
          // AJAX request
          formData = new FormData()

          // loop through all the selected files
          for (var i = 0; i < files.length; i++) {
            var file = files[i]

            // add the files to formData object for the data payload
            formData.append('uploads[]', file, file.name)
          }
        }
        return api.system.upload(formData)
          .then(res => {
            alert('success: ' + JSON.stringify(res))
          })
          .catch((err) => {
            alert(JSON.stringify(err))
          })
      }
    },
    mounted () {},
    beforeDestroy () {}
  }
</script>
