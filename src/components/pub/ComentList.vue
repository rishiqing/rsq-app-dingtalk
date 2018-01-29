<template>
  <ul class="comentlist" :class="{'noComentHeight':!comentCount}">
    <div class="comment-border">
      <v-touch @tap="setCurrentIndex(1)">
        <div class="discuss" :class="{'active':currentIndex === 1}">讨论</div>
      </v-touch>
      <v-touch @tap="setCurrentIndex(2)" >
        <div class="operation" :class="{'active':currentIndex === 2}">操作记录</div>
      </v-touch>
    </div>
    <div v-show="currentIndex === 2">
    <r-record-coment
      v-for="item in recordItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      :more="more"
    ></r-record-coment>
    </div>
    <div v-show="currentIndex === 1">
    <r-todo-coment
      v-for="item in commentItems"
      :disabled="disabled"
      :item="item"
      :key="item.id"
      @comment-file-touch="showAction"
    ></r-todo-coment>
    </div>
    <div v-if="!comentCount && currentIndex === 1" class="noComent">
      <img src="../../assets/img/nocoment.png" alt="">
      <p class="noComentContent">暂无消息</p>
    </div>
  </ul>
</template>
<style>
  /*ul.noComentHeight{*/
    /*padding-bottom: 20px;*/
  /*}*/
  .comment-border{
    height: 1rem;
    display: flex;
    align-items: center;
    padding-left: 0.3rem;
    border-bottom: 1px solid #E0E0E0;
    border-top: 1px solid #E0E0E0;
  }
  .discuss,.operation{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #8C8C8C;
    padding-bottom: 9px;
    padding-top: 9px;
  }
  .operation{
    margin-left: 0.5rem;
  }
  div.active{
    color:#55A8FD;
    position: relative;
    /*border-bottom: 3px solid #55A8FD;*/
  }
  div.active::after{
    content: " ";
    position: absolute;
    /*height: 3px;*/
    right: 0;
    bottom: 0;
    left:0;
    background-color: #55A8FD;
    border-bottom: 3px solid #55A8FD;
  }
  .noComent{
    text-align: center;
    height: 3rem;
  }
  .noComent>img{
    width: 44px;
    height:44px ;
    margin-top: 1.6rem;
  }
  .noComentContent{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: rgba(25,31,37,0.40);
    letter-spacing: 0;
    margin-top: 10px;
  }
  .isDisplay{
    display: none;
  }
  .comentlist{
    background-color: white;
    margin-top: 10px;
    min-height: 3rem;
    max-height: 9rem;
    /*margin-bottom: 5rem;*/
    padding-bottom: 2.9rem;
    /*margin-bottom: 1.4rem;*/
    /*border-top: 1px solid #E0E0E0;*/
  }
</style>
<script>
  import Previewer from 'com/pub/Previewer'
  import ComentItem from 'com/pub/ComentItem'
  import comentRecord from 'com/pub/comentRecord'
  export default {
    data () {
      return {
        more: false,
        currentIndex: 1
      }
    },
    name: 'ComentList',
    props: {
      disabled: Boolean,
      items: Array,
      commentContent: String,
      id: Number
    },
    components: {
      'r-todo-coment': ComentItem,
      'r-record-coment': comentRecord
    },
    computed: {
      recordItems () {
        return this.$store.state.record
//        if (this.items) {
//          return this.items.filter(i => {
//            return i.type !== 0
//          })
//        }
      },
      commentItems () {
        return this.$store.state.comment
      },
//      recordItems () {
//        return this.items.filter(i => {
//          return i.type !== 0
//        })
//      },
//      commentItems () {
//        return this.items.filter(i => {
//          return i.type === 0
//        })
//      },
      comentCount () {
        return this.commentItems.length
//        if (this.items === undefined) {
//          return
//        } else {
//          for (var i = 0; i < this.items.length; i++) {
//            if (this.items[i].type === 0) {
//              return false
//            }
//          }
//          return true
//        }
      }
    },
    methods: {
      setCurrentIndex (index) {
        if (index === 1) {
          this.$store.dispatch('getComment', {id: this.id})
        } else {
          this.$store.dispatch('getRecord', {id: this.id})
        }
        this.currentIndex = index
      },
      getFileName (file) {
        if (!file.name) return ''
        var arr = file.name.split('/')
        return arr[arr.length - 1].substr(14)
      },
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
                Previewer.show({
                  file: f
                })
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
      downloadFile (f) {
        var link = document.createElement('a')
        link.download = this.getFileName(f)
        link.href = f.realPath
        link.click()
      }
    }
  }
</script>
