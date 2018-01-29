<template>
  <div>
    <div class="frequent-head">
      <v-touch @tap="backToKind" class="kind-head">
        <span class="cancel">取消</span>
      </v-touch>
      <span class="title distance">重复频率</span>
    </div>
    <ul class="wrap-list">
      <li v-for="item in frequentlist">
        <v-touch @tap="changeFrequency(item)" class="repeatStyle first">
          <span>{{item}}</span>
        </v-touch>
      </li>
    </ul>
    <div class="another-bottom">
      <span class="another-bottom-text">{{deadlineText}}</span>
    </div>
  </div>
</template>
<style>
  .frequent-head{
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-left: 0.5rem;
  }
</style>
<script>
  export default {
    data () {
      return {
        frequentlist: ['每一周', '每两周', '每三周', '没四周']
      }
    },
    methods: {
      changeFrequency (item) {
        this.$emit('hideFrequency', item)
      },
      backToKind () {
        this.$emit('hideFrequency')
      }
    }
  }
</script>
