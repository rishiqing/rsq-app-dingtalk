<template>
  <div id="calView" class="router-view content--cal calendar">
    <r-calendar
      @click-cal-day="clickDay"
      @after-cal-swipe="afterSwipe"
      :default-select-date="dateSelect"
    ></r-calendar>
    <div style="width: 100%;">
      <r-pull @on-pull-down="pullRefresh">
        <ul>
          <li v-for="i in items" :key="i.id">{{i.name}}</li>
        </ul>
      </r-pull>
    </div>
  </div>
</template>
<style>
  .calendar {
    overflow-y: auto;
  }
</style>
<script>
  import Calendar from 'com/demo/Calendar'
  import Pull from 'com/demo/Pull2Refresh'

  export default {
    data () {
      return {
        items: [
          {id: 1, name: 'aaa'},
          {id: 2, name: 'bbb'},
          {id: 3, name: 'ccc'},
          {id: 4, name: 'ddd'},
          {id: 5, name: 'eee'},
          {id: 6, name: 'fff'},
          {id: 7, name: 'ggg'},
          {id: 8, name: 'hhh'},
          {id: 9, name: 'iii'},
          {id: 10, name: 'jjj'},
          {id: 11, name: 'kkk'},
          {id: 12, name: 'lll'},
          {id: 13, name: 'mmm'},
          {id: 14, name: 'nnn'},
          {id: 15, name: 'ooo'},
          {id: 16, name: 'ppp'},
          {id: 17, name: 'mmm'},
          {id: 18, name: 'nnn'},
          {id: 19, name: 'ooo'},
          {id: 20, name: 'ppp'}
        ]
      }
    },
    computed: {
      dateSelect () {
        return new Date()
      }
    },
    methods: {
      clickDay () {},
      afterSwipe () {},
      pullRefresh (cb) {
        var val = new Date().getTime()
        setTimeout(() => {
          this.items.push({id: 1 + '-' + val, name: 'a' + val})
          this.items.push({id: 2 + '-' + val, name: 'b' + val})
          cb()
        }, 1000)
      }
    },
    components: {
      'r-calendar': Calendar,
      'r-pull': Pull
    },
    mounted () {
      var d = document.getElementById('calView')
      d.addEventListener('scroll', function () {
        alert('-----scrolled------' + d.scrollTop)
      })
    }
  }
</script>
