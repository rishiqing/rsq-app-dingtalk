<template>
  <div class="">
    <div class="edit" >
        <!--<textarea type="text"-->
                  <!--class="edit-text"-->
                  <!--v-if="isEdit"-->
               <!--ref="titleInput"-->
               <!--:value="itemTitle"-->
                  <!--@blur="inputBlur($event.target.value)"-->
               <!--@input="inputChange($event.target.value)"-->
                  <!--:class="{'padding-left-input':isCheckable}"-->
                  <!--@focus="IsDisabled($event)"></textarea>-->
      <v-touch class="wrap-icon"
               v-if="isCheckable"
               @tap="clickCheckOut">
        <i class="icon2-check-box select-title"
           :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"></i>
        <div class="hide" :class="{'for-hide-title':itemChecked}"></div>
        <i class="icon2-selected hide" :class="{'isdisplay-title':itemChecked}"></i>
      </v-touch>
      <input type="text" placeholder="输入任务标题"
              ref="titleInput"
              :value="itemTitle"
              class="word-color"
              @input="inputChange($event.target.value)"
              @blur="inputBlur($event.target.value)"
              :class="{'padding-left-input':isCheckable,'real-width':isMaxlength(itemTitle),'new-padding-left':newCheckable,'inbox-padding-left':!isCheckable,'edit-border':isEdit}"
              @focus="IsDisabled($event)"/>
        <!--@blur="inputBlur($event.target.value)"-->
    </div>
  </div>
</template>
<style scoped>
  .word-color{
    font-family: PingFangSC-Medium;
  }
  .wrap-icon{
    display: flex;
    align-items: center;
    height: 1.28rem;
    position: relative;
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
    border-bottom: 1px solid #e0e0e0;
  }
  .edit{
    display: flex;
    align-items: center;
    position: relative;
    background-color: white;
  }
  .real-width{
    /*width:88%;*/
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap
  }
  .select-title{
    color:#b1b1b1;
    font-size: 0.506rem;
    /*position: absolute;*/
    top:0.39rem;
    /*margin-top: -0.2rem;*/
    margin-left:0.35rem;
    background: #FFFFFF;
    border-radius: 1px;
  }
  .isdisplay-title{
    display: block;
    position:absolute;
    top:0.3rem;
    /*margin-top: -0.29rem;*/
    left: 0.46rem;
    font-size: 15px;
    color:#55A8FD;
  }
  .for-hide-title{
    position: absolute;
    top:0.35rem;
    /*margin-top: -0.29rem;*/
    left: 0.75rem;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .padding-left-input{
    margin-left: 0.32rem;
  }
  .inbox-padding-left{
    padding-left: 0.3rem;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    /*font-family: PingFangSC-Regular;*/
    font-size: 0.506rem;
    color: #8C8C8C;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }
  input[type='text']{
    /*font-family: PingFangSC-Regular;*/
    /*height:1.458rem;*/
    background: #FFFFFF;
    /*border-top:1px solid #E0E0E0 ;*/
    line-height:0.72rem ;
    padding-bottom:0.305rem ;
    padding-top: 0.305rem;
    font-size: 0.506rem;
    border-radius: 0;
  }
  /*.padding-left-input-{*/
    /*padding-left:0.3rem;*/
  /*}*/
  .padding-left-input{
    /*padding-left: 1.5rem;*/
  }
</style>
<script>
  export default {
    data () {
      return {
      }
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
      disabled: Boolean,
      isEdit: Boolean
    },
    methods: {
      isMaxlength (title) {
        title = title || ''
        return title.length > 15
      },
      IsDisabled (e) {
        if (this.disabled) {
          e.target.blur()
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
      },
      inputBlur (value) {
        this.$emit('text-blur', value)
      },
      inputChange (value) {
        this.$emit('text-change', value)
      },
      clickCheckOut () {
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('click-checkout', !this.itemChecked)
      }
    }
//    beforeRouteLeave (to, from, next) {
//      this.$emit('text-blur', this.content)
//    }
  }
</script>
