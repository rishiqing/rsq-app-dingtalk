<template>
  <div class="itm-edt z-index-xs">
    <div class="content">
      <div class="itm-edt-fields" style="padding-bottom: 80px;">
        <div class="itm-group" :class="{'itm--edit-todo': isCheckable}">
          <slot name="slotTitle"></slot>
        </div>
        <div class="itm-group itm--edit-todo" :class="{'is-hidden': !isShowNote}">
          <slot name="slotNote"></slot>
        </div>
        <div class="itm-group itm--edit-todo itm--part-line">
          <slot name="slotContainer"></slot>
          <slot name="slotDate"></slot>
          <slot name="slotTime"></slot>
          <slot name="slotMember"></slot>
          <div class="ding">
            <div class="bottom">
              <p class="">DING</p>
              <p class="message">通过钉钉消息,短信或者电话提醒参与人</p>
            </div>
            <input class="mui-switch" type="checkbox">
          </div>
          <!--<r-input-date></r-input-date>-->
          <!--<r-input-member></r-input-member>-->
          <!--<r-input-alarm></r-input-alarm>-->
          <!--<r-input-progress></r-input-progress>-->
          <slot name="slotSource"></slot>
          <!--<r-input-source></r-input-source>-->
          <!--<r-input-notify></r-input-notify>-->
          <!--<r-input-auth></r-input-auth>-->
        </div>
        <slot name="slotSourceCard"></slot>
        <!--<div class="itm-group itm&#45;&#45;edit-todo">-->
          <!--<r-sub-todo-list></r-sub-todo-list>-->
        <!--</div>-->
        <div class="itm-group itm--edit-todo">
          <slot name="slotComment"></slot>
          <!--<r-comment-list></r-comment-list>-->
        </div>
        <div class="itm-group">
          <slot name="slotCreateButton"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style >
  p{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .bottom {
    height: 2rem;
    display: inline-block;
    padding-left: 11px;
    line-height: 0.1rem;
    position: relative;
    margin-top: 0.7rem;
  }
  .ding{
    height:2rem;
    line-height: 1rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    position:relative;
  }
  .message{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;

  }
  .mui-switch {
    width: 52px;
    height: 31px;
    position: absolute;
    top:0.55rem;
    right:0.1rem;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none; }
  .mui-switch:before {
    content: '';
    width: 29px;
    height: 29px;
    position: absolute;
    top: 0px;
    left: 0;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
  .mui-switch:checked {
    border-color: #67B2FE;
    box-shadow: #67B2FE 0 0 0 16px inset;
    background-color: #67B2FE; }
  .mui-switch:checked:before {
    left: 21px; }
  .mui-switch.mui-switch-animbg {
    transition: background-color ease 0.4s; }
  .mui-switch.mui-switch-animbg:before {
    transition: left 0.3s; }
  .mui-switch.mui-switch-animbg:checked {
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-color: #67B2FE;
    transition: border-color 0.4s, background-color ease 0.4s; }
</style>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      isCheckable: Boolean,
      isShowNote: {
        type: Boolean,
        default: true
      }
    },
    methods: {
    },
    components: {},
    ready () {
    }
  }
</script>
