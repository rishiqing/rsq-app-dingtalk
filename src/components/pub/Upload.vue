<template>
  <div style="position:relative;">
    <input
      id="imgInp"
      class="file-input"
      type="file"
      name="uploads[]"
      multiple="multiple"
      @change="addToTask">
    <ul class="ul-list">
      <r-upload-item
        v-for="(task, index) in taskList"
        :key="index"
        :task="task"
        @upload-item-delete="deleteTask"/>
    </ul>
  </div>
</template>
<script>
  import UploadItem from 'com/pub/UploadItem'
  export default {
    name: 'Upload',
    components: {
      'r-upload-item': UploadItem
    },
    data () {
      return {
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
      corpId () {
        return this.loginUser.authUser.corpId
      },
      unionId () {
        return this.loginUser.authUser.unionId
      },
      userId () {
        return this.loginUser.authUser.userId
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
        this.$emit('remove-file-id', task.img.name)
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
          if (parseInt(file.size) > 50 * 1024 * 1024) {
            window.rsqadmg.execute('alert', {message: '单个文件大小不能超过50M'})
//            window.dd.device.notification.alert({
//              message: '上传文件最大容量不超过50M',
//              title: '提示', // 可传空
//              buttonName: '确定',
//              onSuccess: function () {
//              }
//            })
          } else {
            var url = URL.createObjectURL(file)
            this.taskList.push({
              finished: false,
              isShowProgress: true,  //  刚创建未上传时显示进度条
              progress: 0,
              img: {
                name: file.name,
                src: url
              },
              file: file
            })
          }
        }
        document.getElementById('imgInp').value = ''
        this.triggerUpload()
      },
      //  上传
      triggerUpload () {
        if (this.unfinishedTask.length > 0) {
          this.$emit('ready-to-upload', this.unfinishedTask)
        }
        //  同时上传需要做数量控制，因此不做同时上传，只做顺序上传
        //  由于一个公司之间的文件需要共享预览，所以以corpId作为pathId
        return this.$store.dispatch('uploadToOSS', {
          pathId: this.corpId,
          list: this.unfinishedTask
        }).then(res => {
          // 在这里发送getfromAli
          for (var i = 0; i < res.length; i++) {
            var name = res[i].name
            this.$store.dispatch('toRsqServer', {name: name}).then(res => {
              this.$emit('get-file-id', {id: res.id, name: res.name.substr(14)})
              this.$emit('finish-upload')
            })
          }
        })
      },
      cancelUpload () {
        this.$store.dispatch('cancelUploadToOSS', {
          pathId: this.unionId
        }).then(() => {
          // alert(1)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ul-list{
    margin-top: -8px;
  }
  .file-input {
    cursor: pointer;
    position:absolute;
    top: -1rem;
    font-size:30px;
    left:0.3rem;
    width:0.848rem;
    // height: 0.7rem;
    /*Opacity settings for all browsers*/
    opacity: 0;
    -moz-opacity: 0;
    filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)
  }
</style>
