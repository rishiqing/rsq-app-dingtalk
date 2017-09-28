<template>
  <ul class="comentlist">
    <v-touch @tap="changeState()">
      <div :class="{'isDisplay': !more}" class="operation">收起操作记录</div>
      <div :class="{'isDisplay': more}" class="operation">显示操作记录</div>
    </v-touch>
    <r-record-coment
      v-for="item in items"
      :item="item"
      :key="item.id"
      :more="more"
      v-if="item.type!=0"
    ></r-record-coment>
    <r-todo-coment
      v-for="item in items"
      :item="item"
      :key="item.id"
      v-if="item.type===0"
    ></r-todo-coment>
    <div  v-if="this.comentCount===0" class="noComent">
      <img src="../../assets/img/nocoment.png" alt="">
      <p class="noComentContent">暂无评论</p>
    </div>
  </ul>
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
    border-top: 1px solid #E0E0E0;
  }
  .operation{
    line-height:1.083rem;
    padding-left: 0.333rem;
    font-family: PingFangSC-Regular;
    color:#55A8FD;
    font-size:15px ;
    background-color: white;
    width: 100%;
    border-bottom: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
</style>
<script>
  import ComentItem from 'com/pub/ComentItem'
  import comentRecord from 'com/pub/comentRecord'
  export default {
    data () {
      return {
        more: false,
        comentCount: 0
      }
    },
    name: 'ComentList',
    props: {
      items: Array,
      commentContent: String
    },
    components: {
      'r-todo-coment': ComentItem,
      'r-record-coment': comentRecord
    },
    computed: {
    },
    methods: {
      changeState () {
        this.more = !this.more
      }
    },
    mounted () {
      if (this.items === undefined) {
        return
      } else {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].type === 0) {
            this.comentCount++
          }
        }
      }
    }
  }
</script>
