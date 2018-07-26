<template>
  <div class="">
    <div class="edit" :class="{editInput: !isEdit}">
      <v-touch class="wrap-icon"
               v-if="isCheckable"
               @tap="clickCheckOut">
        <i class="icon2-check-box select-title"
           :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"></i>
        <div class="hide" :class="{'for-hide-title':itemChecked}"></div>
        <i class="icon2-selected hide" :class="{'isdisplay-title':itemChecked}"></i>
      </v-touch>
      <textarea type="text" placeholder="输入任务标题"
              ref="titleInput"
              :value="itemTitle"
              class="text-input"
              @input="inputChange($event.target.value)"
              @blur="inputBlur($event.target.value)"
              :class="{'isEdit': isEdit, 'padding-left-input':isCheckable,'real-width':isMaxlength(itemTitle),'new-padding-left':newCheckable,'inbox-padding-left':!isCheckable,'edit-border':isEdit,'edit-text-font':isEdit,'new-text-font':newCheckable}"
              @focus="IsDisabled($event)">
      </textarea>
    </div>
  </div>
</template>
<style scoped>
  .text-grey{

  }
  .text-mid-line{

  }
  .editInput{
    border-bottom: 1px solid #E0E0E0;
    border-top: 1px solid #E0E0E0;
  }
  .edit .isEdit{
    height: 1.193rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 8.5rem;
    border: 0px;
    display: block;
  }
  .text-input{
    background: #FFFFFF;
    line-height:0.72rem ;
    padding-bottom:0.305rem ;
    padding-top: 0.305rem;
    font-size: 0.506rem;
    border-radius: 0;
    height: 2.666rem;
    resize: none;
    /*width: 8rem;*/
    text-overflow: ellipsis;
    overflow: hidden;
    color:#3D3D3D;
    display: block;
  }
  .edit-text-font{
    font-family: PingFangSC-Medium;
  }
  .new-text-font{
    font-family: PingFangSC-Regular;
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
    position: relative;
    background-color: white;
    display: flex;
    align-items: center;
    /*border-bottom: 1px solid #e0e0e0;*/
    border-top: 1px solid #e0e0e0;
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
    left: 0.46rem;
    font-size: 15px;
    color:#55A8FD;
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
    padding-left: 0.2rem;
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
    padding-top: 0;
  }
  input[type='text']{
    background: #FFFFFF;
    line-height:0.72rem ;
    padding-bottom:0.305rem ;
    padding-top: 0.305rem;
    font-size: 0.506rem;
    border-radius: 0;
    height: 2.666rem;
  }
  .padding-left-input{
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
      toEditText () {
        this.$route.push('/editTitle')
      },
      onPanMove () {
//        console.log('jjjjjjj')
//        alert('Hhh')
      },
      isMaxlength (title) {
        title = title || ''
        return title.length > 15
      },
      IsDisabled (e) {
        if (this.disabled) {
          e.target.blur()
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        } else if (this.isEdit) {
          this.$router.push('/editTitle')
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
    },
    mounted () {
//      var that = this
//      if (that.newCheckable) {
//        that.$refs.titleInput.focus()
//      }
    },
    beforeRouteLeave (to, from, next) {
      console.log('触发了')
//      this.$emit('text-blur', this.content)
    }
  }
</script>
