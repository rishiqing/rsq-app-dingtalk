<template>
  <div class="explain">
    <div class="explain-top">
      <p class="introduce">日事清2.0版本的新功能介绍</p>
      <p class="explain-time">2017年10月1日</p>
    </div>
    <div class="explain-bottom">
      <div class="">
        <p class="explain-title">1.简洁的日程管理</p>
        <p class="explain-content">日程信息，一目了然，并且可以在任务详情中参与任务讨论。</p>
        <div class="explain-img">
          <img src="../../assets/img/sche1.png" alt="">
        </div>
      </div>
      <div class="">
        <p class="explain-title">2.收纳箱</p>
        <p class="explain-content">在收纳箱中，会自动收纳来自同事或计划的任务。收纳箱中的任务没有日期，设置日期后会自动添至日程。</p>
        <div class="explain-img">
          <img src="../../assets/img/inbox.png" alt="">
        </div>
      </div>
      <div class="">
        <p class="explain-title">3.把日程分享到聊天中</p>
        <p class="explain-content">现在可以把日程分享给同事看了，并且同事可以参与日程讨论。</p>
        <div class="explain-img">
          <img  class="last-picture" src="../../assets/img/explain-3.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  p{
    margin:0;
  }
  .explain{
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: white ;
  }
  .explain-top{
    margin-top: 15px;
    border-bottom: 1px solid #E0E0E0;
  }
  .introduce{
    font-size: 25px;
    font-family: PingFangSC-Regular;
    color: #000000;
    letter-spacing: 0;
  }
  .explain-time{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #E0E0E0;
    letter-spacing: 0;
  }
 .explain-title{
   font-family: PingFangSC-Regular;
   font-size: 17px;
   color: #000000;
   letter-spacing: 0;
 }
  .explain-content{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #323334;
    letter-spacing: 0;
    line-height: 18px;
    margin-top: 5px;
  }
 .explain-img>img{
   width: 5.648rem;
   /*height: 8.864rem;*/
 }
  .explain-img .last-picture{
   width: 4.5rem;
 }
 .explain-img{
   width: 9.32rem;
   display: flex;
   align-items: center;
   justify-content: center;
 }
  .explain-bottom>div{
    margin-top: 10px;
    /* border-bottom: 1px solid #E4E4E4;*/
  }
</style>
<script>



</script>
