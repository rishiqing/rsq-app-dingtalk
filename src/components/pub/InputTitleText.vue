<template>
  <div class="">
    <div class="edit">
      <v-touch
        v-if="isCheckable"
        class="wrap-icon"
        @tap="clickCheckOut">
        <i
          :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"
          class="icon2-check-box select-title"/>
        <i
          :class="{'is-display-title':itemChecked}"
          class="icon2-selected hide"/>
      </v-touch>
      <div class="pb">
        <input
          ref="titleInput"
          :value="itemTitle"
          :class="{'padding-fix':!isCheckable,'edit-border':isShowBottomBorder}"
          :placeholder="placeholder"
          class="title-input"
          type="text"
          @input="inputChange"
          @blur="inputBlur"
          @focus="checkDisabled">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'InputTitleText',
    props: {
      //  标题的内容，默认为空字符串
      itemTitle: {
        type: String,
        default: ''
      },
      //  是否显示checkbox选择框
      isCheckable: {
        type: Boolean,
        default: false
      },
      //  是否为选中状态
      itemChecked: {
        type: Boolean,
        default: false
      },
      //  是否被禁用编辑
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      },
      //  是否显示底部的border
      isShowBottomBorder: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        placeholder: '请输入任务标题'
      }
    },
    computed: {},
    methods: {
      checkDisabled (e) {
        if (this.isDisabled) {
          e.target.blur()
          if (this.disabledText) {
            window.rsqadmg.execute('toast', {message: this.disabledText})
          }
        }
      },
      inputBlur (e) {
        this.$emit('text-blur', e.target.value)
      },
      inputChange (e) {
        this.$emit('text-change', e.target.value)
      },
      clickCheckOut () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .edit-text-font{
    font-family: PingFangSC-Medium;
  }
  .wrap-icon{
    display: flex;
    align-items: center;
    height: 64px;
    position: absolute;
    justify-content:center;
    // width: 1.2rem;
    margin-left: 15px;
  }
  .edit-text{
    font-family: PingFangSC-Medium;
    font-size: 0.506rem;
    color: #333333;
    letter-spacing: 0;
  }
  .hide{
    display: none;
  }
  .edit-border{
    // border-bottom: 0.5px solid #D4D4D4;
  }
  .edit{
    font-size: 17px;
    display: flex;
    align-items: center;
    position: relative;
    background-color: white;
  }
  .title-input{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap
  }
  .select-title{
    color:#b1b1b1;
    font-size: 20px;
    // top:0.39rem;
    // margin-left:20px;
    background: #FFFFFF;
    border-radius: 1px;
  }
  .is-display-title{
    display: block;
    // transform: translateX(-17px) translateY(0px);
    font-size: 15px;
    color: #999;
    margin-left: -17px;
  }
  .for-hide-title{
    position: absolute;
    top:0.35rem;
    left: 0.75rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .padding-left-input{
    margin-left: 0.1rem;
    padding-left: 0.3rem;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 17px;
    height: 100%;
    line-height: 17px;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
    padding-top: 2px;
  }
  .pb{
    height: 100%;
    width: 100%;
    margin-left: 15px;
  }
  .pb:after{
    margin-left: 15px;
    content: " ";
    position: absolute;
    left: 0;
    bottom: -1px;
    right: 0;
    height: 1px;
    border-top: 1px solid #d4d4d4;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  input[type='text']{
    height: 64px;
    background: #FFFFFF;
    line-height:24px ;
    padding: 0.3rem;
    border-radius: 0;
    color: #3D3D3D;
    // margin-left: 15px;
    padding-left: 35px;
  }
  .padding-fix{
    padding-left: 0 !important;
  }
</style>
