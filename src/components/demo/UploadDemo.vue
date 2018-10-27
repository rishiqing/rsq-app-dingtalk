<template>
  <div>
    <input
      id="coverImage"
      class="file-input"
      type="file"
      name="uploads[]"
      multiple="multiple"
      @change="addCoverImage">
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'UploadDemo',
    methods: {
      addCoverImage (e) {
        const file = e.target.files[0]
        const time = moment().format('YYYYMMDDHHmmss')
        const extName = file.name.split('.')[1]
        if (!extName) {
          return alert('扩展名不存在')
        }
        const savedName = time + '.' + extName
        const task = {
          finished: false,
          isShowProgress: true,  //  刚创建未上传时显示进度条
          progress: 0,
          file: file
        }
        return this.$store.dispatch('uploadKanbanCoverImage', {
          pathId: 'wxec002534a59ea2e7',
          task: task,
          savedName: savedName
        }).then(res => {
          // 在这里发送getfromAli
          console.log('发送成功！' + JSON.stringify(res))
          console.log('访问地址：https://images.timetask.cn/cover/custom/kanban/' + savedName)
        })
      }
    }
  }
</script>

<style scoped>
</style>
