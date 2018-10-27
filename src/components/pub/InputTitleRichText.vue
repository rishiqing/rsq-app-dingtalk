<template>
  <!--富文本编辑的标题-->
  <div class="itm-edt-fields">
    <div class="edit-wrap" >
      <v-touch
        class="wrap-icon"
        @tap="clickCheckOut">
        <i
          :class="{'icon-check_box_outline_blank': !itemChecked, 'icon-check': itemChecked}"
          class="icon2-check-box select-title"/>
        <div
          :class="{'for-hide-title':itemChecked}"
          class="hide"/>
        <i
          :class="{'isdisplay-title':itemChecked}"
          class="icon2-selected hide" />
      </v-touch>
      <div
        ref="textEditor"
        contenteditable="true"
        class="rich-title"
        @input="inputChange">{{ itemTitle }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'InputTitleRichText',
    props: {
      itemTitle: {
        type: String,
        required: true
      },
      itemChecked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    computed: {},
    methods: {
      clickCheckOut () {
        if (this.disabled) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$emit('click-checkout', !this.itemChecked)
      },
      inputChange () {
        this.$emit('text-change', this.$refs.textEditor.innerHTML)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rich-title {
    display: inline-block;
    background: #FFFFFF;
    line-height:0.72rem ;
    padding-left: 0.8rem;
    font-size: 0.506rem;
    border-radius: 0;
    color: #3D3D3D;
    outline: none;
  }
  .edit-wrap{
    position: relative;
    background-color: #FFFFFF;
    padding: 0.3rem;
  }
  .wrap-icon{
    position: absolute;
    top: 50%;
    left: 0.3rem;
    height: 0.5rem;
    margin-top: -0.25rem;
  }
  .hide{
    display: none;
  }
  .select-title{
    color:#b1b1b1;
    font-size: 0.506rem;
    background: #FFFFFF;
    border-radius: 1px;
  }
  .for-hide-title{
    position: absolute;
    top:0;
    right: 0;
    display: block;
    width: 2px;
    height: 2px;
    background-color: white;
    border: 1px solid white;
  }
  .isdisplay-title{
    display: block;
    position:absolute;
    top:0.03rem;
    left: 0.05rem;
    font-size: 15px;
    color:#55A8FD;
  }
</style>
