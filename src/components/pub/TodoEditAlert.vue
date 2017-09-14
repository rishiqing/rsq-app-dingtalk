<template>
  <div class="edit-alert">
    <ul class="top-ul">
      <v-touch tag="li" @tap="disableAlert">
        <span>不提醒</span>
        <i class="icon2-selected finish" v-show="notUseAlert"></i>
      </v-touch>
    </ul>
    <ul class="alert-list">
      <v-touch tag="li" @tap="selectAlert(alert)" v-for="alert in alertList" :key="alert.cid">
        <span>{{parseCode(alert.point, alert.num, alert.unit)}}</span>
        <i class="icon2-selected finish" v-show="alert.selected"></i>
      </v-touch>
    </ul>
    <!--<ul class="sec">-->
      <!--<v-touch tag="li" @tap="show">-->
        <!--<span class="remind">自定义提醒时间</span>-->
        <!--<span class="time">14:22</span>-->
      <!--</v-touch>-->
    <!--</ul>-->
  </div>
</template>
<style>
  .edit-alert {
    .remind{
      display: block;
      margin-left: 0.2rem;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #55A8FD;
    }
    .time{
      position: absolute;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #999999;
      letter-spacing: 0;
      right:0.63rem;
      top:0.23rem;
    }
    .finish{
      position:absolute;
      right:0.63rem;
      top:0.33rem;
      color: #55A8FD;
      font-weight: bold;
    }
    ul{
      position: relative;
      border-bottom: 0.5px solid #E3E3E3;
      border-top: 0.5px solid #E3E3E3;
      background: #FFFFFF;
    }
    .top-ul {
      margin-top:1.938rem;
    }
    .sec{
      margin-top: 0.373rem;
    }

    span{
      /*line-height: 1.112rem;*/
      display:block;
      margin-left: 0.45rem;

    }
    li{
      position: relative;
      padding:5px;
      line-height: 0.912rem;
      height: 0.912rem;
      border-bottom: 0.5px solid #E3E3E3;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #3D3D3D;
    }
    li:last-child{
      border:none;
    }
  }

</style>
<script>
  import eventBus from 'ut/eventBus'
  import jsUtil from 'ut/jsUtil'

  export default {
    data () {
      return {
        notUseAlert: true,
        //  系统的提醒时间
        alertList: [
          {cid: 0, point: 'begin', num: 0, unit: 'min', selected: false},
          {cid: 1, point: 'begin', num: -5, unit: 'min', selected: false},
          {cid: 2, point: 'begin', num: -15, unit: 'min', selected: false},
          {cid: 3, point: 'begin', num: -30, unit: 'min', selected: false},
          {cid: 4, point: 'begin', num: -1, unit: 'hour', selected: false},
          {cid: 5, point: 'end', num: -1, unit: 'hour', selected: false}
        ],
        //  用户自定义的提醒时间
        userAlertList: []
      }
    },
    computed: {
      todoTime () {
        return this.$store.state.pub.currentTodoTime
      }
    },
    methods: {
      initData () {
        var hasAlert = false
        if (this.todoTime && this.todoTime.todo && this.todoTime.todo.clock) {
          var passedAlertArray = this.todoTime.todo.clock.alert
          if (passedAlertArray) {
            passedAlertArray.forEach(remoteAlert => {
              var localAlert = this.alertList.find(localAlert => {
                return [localAlert.point, localAlert.num, localAlert.unit].join('_') === remoteAlert.schedule
              })
              if (localAlert) {
                hasAlert = true
                localAlert.selected = true
              }
            })
          }
        }
        this.notUseAlert = !hasAlert
      },
      disableAlert () {
        this.notUseAlert = !this.notUseAlert
        if (this.notUseAlert) {
          this.alertList.forEach(a => {
            a.selected = false
          })
        }
      },
      selectAlert (a) {
        a.selected = !a.selected
        if (a.selected) {
          this.notUseAlert = false
        }
      },
      parseCode (point, num, unit) {
        return jsUtil.alertCode2Text([point, num, unit])
      },
      parseUserDefined () {},
      parseAlertData (obj) {
        return {
          id: obj.id,
          schedule: obj.isUserDefined ? this.parseUserDefined(obj) : ([obj.point, obj.num, obj.unit].join('_')),
          isUserDefined: !!obj.isUserDefined
        }
      },
      getResult () {
        return this.alertList
          .filter(a => {
            return a.selected
          }).map(sel => {
            return this.parseAlertData(sel)
          })
      }
    },
    mounted () {
      this.initData()
      window.rsqadmg.execute('setTitle', {title: '设置提醒'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'todoEditTime') {
        eventBus.$emit('todo-edit-alert-ready', this.getResult())
      }
      next()
    }
  }
</script>
