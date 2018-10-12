<template>
  <li
    :class="{ 'isDisplay': !more}"
    class="list">
    <div
      v-if="item.type === 9"
      class="comment-record">
      <span class="icon"><i class="icon-description"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
      <p class="child-item">{{ item.idOrContent }}</p>
    </div>
    <div
      v-else-if="item.type === 5"
      class="comment-record">
      <span class="icon"><i class="icon-check"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 7"
      class="comment-record">
      <span class="icon"><img src="../../assets/img/changer.png"></span>
      <span class="content">{{ item.commentContent }}</span>
      <p class="child-item">{{ item.idOrContent }}</p>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 17"
      class="comment-record">
      <span class="icon"><img src="../../assets/img/changer.png"></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 10"
      class="comment-record">
      <span class="icon"><img src="../../assets/img/changer.png"></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 8"
      class="comment-record">
      <span class="icon"><i class="icon-description"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
      <p
        class="child-item more-description"
        v-html="item.idOrContent"/>
    </div>
    <div
      v-else-if="item.type === 1"
      class="comment-record">
      <span class="icon"><img src="../../assets/img/addmem2.png"></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 3"
      class="comment-record">
      <span class="icon"><i class="icon2-member"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 6"
      class="comment-record">
      <span class="icon"><i class="icon-check_box_outline_blank"/></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div
      v-else-if="item.type === 2"
      class="comment-record">
      <span class="icon"><img src="../../assets/img/chengday.png"></span>
      <span class="content">{{ item.commentContent }}</span>
      <div class="time">{{ displayDateString }}</div>
    </div>
    <div v-else />
  </li>
</template>
<script>
  export default {
    name: 'CommentRecord',
    props: {
      item: {
        type: Object,
        required: true
      },
      more: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    computed: {
      loginUser () {
        return this.$store.state.loginUser
      },
      displayDateString () {
        const d = this.item.dateCreated
        return d.substring(5, 7) + '月' + d.substring(8, 10) + '日 ' + d.substring(11, 16)
      }
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .list{
    display: flex;
    align-items: center;
    line-height: 0.7rem;
    border-bottom: none;
    margin-top:10px;
    padding-left: 0.4rem;
  }
  .comment-record{
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 20px;
    flex-wrap: wrap;
  }
  .isDisplay{
    display: none;
  }
  .photo{
    display: inline-block;
  }
.child-item{
    color: #999999;
    font-size: 13px;
  }
  .child-item{
    margin-left: 1rem;
    margin-bottom: 0;
    // background-color: lightyellow;
    width: 84%;
  }
  .content{
    margin-left: 3px;
    width: 80vw;
        color: #999999;
    font-size: 16px;
        text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .icon{
    width: 30px;
    text-align: left;
    font-size: 16px;
    color:#ACACAC;
  }
  .time{
    font-size: 13px;
    color:#999999;
    margin-left: 34px;
    // display: inline-block;
  }
  .more-description{
    max-height: 100px;
    overflow: hidden;
    display: none;
  }
  img{
    width: 15px;
    height: 15px;
    margin-left: 8px;
  }
  i{
    margin-left: 8px;
  }
</style>
