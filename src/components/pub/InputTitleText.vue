<template>
  <div class="">
    <div class="edit">
        <input type="text" placeholder="输入任务标题"
               ref="titleInput"
               :value="itemTitle"
               class="padding-left-input-"
               @input="inputChange($event.target.value)"
               @blur="inputBlur($event.target.value)"
               :class="{'padding-left-input':isCheckable,'real-width':isMaxlength(itemTitle),'new-padding-left':newCheckable,'inbox-padding-left':!isCheckable}"
               @focus="disabled ? $event.target.blur() : function(){}">
      <div class="padding-left-">
      <v-touch class=""
           v-if="isCheckable"
           @tap="clickCheckOut">
        <i class="icon2-check-box select-title"
           :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"></i>
        <div class="hide" :class="{'for-hide-title':itemChecked}"></div>
        <i class="icon2-selected hide" :class="{'isdisplay-title':itemChecked}"></i>
      </v-touch>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .hide{
    display: none;
  }
  .edit{
    display: flex;
    align-items: center;
    border-bottom:1px solid #E0E0E0 ;
    position: relative;
  }
  .real-width{
    /*width:88%;*/
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap
  }
  .select-title{
    color:#b9b9bc;
    font-size: 17px;
    position: absolute;
    top:50%;
    margin-top: -0.17rem;
    left:0.35rem;
    background: #FFFFFF;
    border-radius: 1px;
  }
  .isdisplay-title{
    display: block;
    position:absolute;
    top:50%;
    margin-top: -0.29rem;
    left: 0.44rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide-title{
    position: absolute;
    top:50%;
    margin-top: -0.29rem;
    left: 0.75rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .padding-left-input{
    padding-left: 1.1rem;
  }
  .inbox-padding-left{
    padding-left: 0.3rem;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: PingFangSC-Regular;
    font-size: 19px;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }
  input[type='text']{
    font-family: PingFangSC-Regular;
    /*height:1.458rem;*/
    background: #FFFFFF;
    border-top:1px solid #E0E0E0 ;
    line-height:0.7rem ;
    padding-bottom:0.405rem ;
    padding-top: 0.405rem;
    font-size: 19px;
  }
  /*.padding-left-input-{*/
    /*padding-left:0.3rem;*/
  /*}*/
  .padding-left-input{
    padding-left: 1.5rem;
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      paddingObject () {
        if (!this.isCheckable) {
          return {'padding-left': '0'}
        } else {
          return {}
        }
      }
    },
    props: {
      newCheckable: Boolean,
      isCheckable: Boolean,
      itemTitle: String,
      itemChecked: Boolean,
      disabled: Boolean
    },
    methods: {
      isMaxlength (title) {
        title = title || ''
        return title.length > 15
      },
      inputBlur (value) {
        this.$emit('text-blur', value)
      },
      inputChange (value) {
        this.$emit('text-change', value)
      },
      clickCheckOut () {
        if (this.disabled) return
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
  }
</script>
