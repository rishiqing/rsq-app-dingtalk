<template>
  <div>
    <p>pull 2 refresh demo</p>
    <div class="container">
      <r-pull-to-refresh @on-pull-down="pullRefresh">
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
  import Pull from 'com/demo/Pull2Refresh'
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
      pullRefresh (cb) {
        setTimeout(() => {
          this.items = [
            {id: 11, name: 'aaa000'},
            {id: 12, name: 'bbb000'},
            {id: 13, name: 'ccc000'},
            {id: 14, name: 'ddd000'}
          ]
          cb()
        }, 1000)
      }
    }
  }
</script>
