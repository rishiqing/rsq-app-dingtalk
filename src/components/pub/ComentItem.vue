<template>
  <li class="coment" >
      <div class="left">
        <avatar :src="loginUser.authUser.avatar"
                :username="loginUser.authUser.name"
                :size="30">
        </avatar>
      </div>
      <div class="right">
        <div class="top">
          <span class="author">{{item.authorName}}</span>
          <span class="time">{{item.dateCreated.substring(5,7)}}月{{item.dateCreated.substring(8,16)}}</span>
        </div>
        <div class="bottom">
          <div class="comentContent">{{item.commentContent}}</div>
        </div>
      </div>
  </li>
</template>
<style scoped>
  .coment{
    padding-left: 3%;
    margin-top:20px ;
    line-height: 0.7rem;
    border-bottom: none;
  }
  .coment:after{
    display: block;
    content: '';
    clear: both;
  }
  .time{
    font-size: 12px;
    color:#999999;
    width: 2.186rem;
    position: absolute;
    right:0.68rem;
  }
  .left{
    width: 1.093rem;
    float: left;
    zoom: 1;
  }
  .right{
    padding: 0;
    width: calc(100% - 52px);
    float: left;
    border: none;
  }
  .top{
    display: flex;
    align-items: center;
    padding-right: 0.3rem;
    margin-top: -4px;
  }
  .author{
    width: 5.733rem;
    font-family: STHeitiSC-Light;
    font-size: 13px;
    color: #999999;
    letter-spacing: 0;
  }
  .comentContent{
    width: 94%;
    font-family: STHeitiSC-Light;
    font-size: 16px;
    color: #111111;
    letter-spacing: 0;
    line-height: 21px;
  }
</style>
<script>
  import Avatar from 'com/pub/TextAvatar'
  export default {
    data () {
      return {
      }
    },
    computed: {
      loginUser () {
        return this.$store.state.loginUser
      }
    },
    props: {
      item: Object,
      more: Boolean
    },
    components: {
      'avatar': Avatar
    },
    methods: {
    }
  }
</script>
