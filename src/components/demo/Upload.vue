<template>
  <!--用来测试用的页面，不应用在生产环境中-->
  <div class="">
      <input class="file-input" type="file" id="imgInp" name="uploads[]" multiple="multiple" @change="addToTask"/>
      <ul class="ul-list">
        <li v-for="task in taskList" class="taskList">
          <img class="preview-img" :src="task.img.src" alt="task.img.name"/>
          <span class="word">{{task.img.name.substr(0,30)}}</span>
          <v-touch @tap="deleteTask(task)">
            <i class="icon2-error deleteComent"></i>
          </v-touch>
          <!--<p v-if="t.finished">上传完成</p>-->
          <!--<p v-else>上传进度:{{t.progress}}%</p>-->
        </li>
      </ul>
      <!--<v-touch class="form-control" @tap="uploadToOSS">-->
        <!--<input class="u-full-width" type="button" value="上传文件"/>-->
      <!--</v-touch>-->
  </div>
</template>
<style lang="scss">
  .deleteComent{
    color: #DEDEDE;
    font-size: 18px;
    position: absolute;
    top: 0.4rem;
    right:0.7rem
  }
  img{
    width: 27px;
    height: 27px;
  }
  .ul-list{
    margin-top: -15px;
  }
  .word{
    font-family:AppleSystemUIFont;
    font-size: 13px;
    color: #3D3D3D;
    margin-left: 10px;
  }
  .taskList {
    position: relative;
    display:flex;
    align-items: center;
    border-top: 1px solid #E0E0E0;
    background-color: white;
    padding-left: 13px;
    height: 1.2rem;
  }
  .taskList:last-child{
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .init-form {
    position: absolute;left: 10%;width: 80%;top: 20%;padding: 10px;font-size: 16px;
  }
  .u-full-width {
    position: absolute;
    top:10rem
  }
  .file-input {
    cursor: pointer;
    position:absolute;
    top: 4.3rem;
    font-size:30px;
    width: 30px;
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
      unionId () {
        return this.loginUser.authUser.unionId ? this.loginUser.authUser.unionId : 'dingtalkupload'
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      unfinishedTask () {
        return this.taskList.filter(t => {
          return !t.finished
        })
      }
    },
    methods: {
      deleteTask (task) {
        for (var i = 0; i < this.taskList.length; i++) {
          if (task.img.name === this.taskList[i].img.name) {
            this.taskList.splice(i, 1)
          }
        }
        this.$emit('removeFileId', task.img.name)
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
        this.uploadToOSS()
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
        // var len = this.unfinishedTask.length
        var time = new Date()
        var year = time.getFullYear()
        var month = time.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        var day = time.getDate()
        if (day < 10) {
          day = '0' + day
        }
        var hour = time.getHours()
        if (hour < 10) {
          hour = '0' + hour
        }
        var minute = time.getMinutes()
        if (minute < 10) {
          minute = '0' + minute
        }
        var second = time.getSeconds()
        if (second < 10) {
          second = '0' + second
        }
        var standardTime = year + month + day + hour + minute + second
        this.getToken()
          .then(client => {
            //  同时上传需要做数量控制，因此不做同时上传，只做顺序上传
            return this.$store.dispatch('uploadToOSS', {
              client: client,
              path: this.ossRootPath + this.userId + '/' + standardTime,
              list: this.unfinishedTask
            }).then(res => {
              // 在这里发送getfromAli
              for (var i = 0; i < res.length; i++) {
                var name = res[i].name
                this.$store.dispatch('toRsqServer', {name: name}).then(res => {
                  this.$emit('getFileId', {id: res.id, name: res.name.substr(14)})
                })
              }
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
          formData = new FormData()
          for (var i = 0; i < files.length; i++) {
            var file = files[i]
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
