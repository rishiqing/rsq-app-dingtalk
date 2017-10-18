<template>
  <div class="router-view content--cal">
    <r-calendar
      @click-cal-day="clickDay"
      @after-cal-swipe="afterSwipe"
      :default-select-date="dateSelect"
    ></r-calendar>
    <div style="width: 100%; height: 800px; padding-top: 100px;">
      <div style="">
        this is a item list
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>
  import Calendar from 'com/demo/Calendar'

  export default {
    data () {
      return {}
    },
    computed: {
      dateSelect () {
        return new Date()
      }
    },
    methods: {
      clickDay () {},
      afterSwipe () {}
    },
    components: {
      'r-calendar': Calendar
    },
    created () {}
  }
</script>
