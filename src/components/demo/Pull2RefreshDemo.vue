<template>
  <div>
    <p>pull 2 refresh demo</p>
    <v-touch @panstart="onPanMove"
             @panmove="onPanMove"
             @panend="onPanEnd"
             @pancancel="onPanEnd" >
      <div style="overflow-y:auto;height:200px;">
        <div style="width:100%;height:1000px;background:#f00;"></div>
      </div>
    </v-touch>
    <div class="container">
      <r-pull-to-refresh
        :enabled="true"
        @on-pull-down="pullRefresh">
        <ul>
          <li v-for="i in items" :key="i.id">{{i.name}}</li>
        </ul>
      </r-pull-to-refresh>
    </div>
  </div>
</template>
<style scoped>
  .container {
    width: 100%;
    box-sizing: border-box;
    border: solid 1px #f00;
  }
</style>
<script>
  import Pull from 'com/pub/Pull2Refresh'
  export default {
    data () {
      return {
        items: [
          {id: 1, name: 'aaa'},
          {id: 2, name: 'bbb'},
          {id: 3, name: 'ccc'},
          {id: 4, name: 'ddd'},
          {id: 4, name: 'aaa'},
          {id: 2, name: 'bbb'},
          {id: 3, name: 'ccc'},
          {id: 4, name: 'ddd'},
          {id: 1, name: 'aaa'},
          {id: 2, name: 'bbb'},
          {id: 3, name: 'ccc'},
          {id: 4, name: 'ddd'},
          {id: 1, name: 'aaa'},
          {id: 2, name: 'bbb'},
          {id: 3, name: 'ccc'},
          {id: 4, name: 'ddd'}
        ]
      }
    },
    components: {
      'r-pull-to-refresh': Pull
    },
    methods: {
      onPanMove (e) {
        console.log('onPanMove:' + e.deltaY)
      },
      onPanEnd (e) {
        console.log('onPanEnd')
      },
      pullRefresh (cb) {
        setTimeout(() => {
          var val = new Date().getTime()
          this.items.push({id: 1 + '-' + val, name: 'a' + val})
          this.items.push({id: 2 + '-' + val, name: 'b' + val})
          cb()
        }, 1000)
      }
    }
  }
</script>
