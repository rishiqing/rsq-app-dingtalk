<template>
  <div class="router-view content--cal">
    <r-calendar
      @click-cal-day="clickDay"
      @after-cal-swipe="afterSwipe"
      :default-select-date="dateSelect"
    ></r-calendar>
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
